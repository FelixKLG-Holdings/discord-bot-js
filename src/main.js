require('dotenv').config();
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });

const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.commands = new Collection();

const folders = fs.readdirSync('./src/commands');

for (const folder of folders) {
	const commandFolders = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFolders) {
		const command = require(`./commands/${folder}/${file}`);

		client.commands.set(command.data.name, command);
	}
}

client.selectors = new Collection();

const selectorFiles = fs.readdirSync('./src/selector/').filter(file => file.endsWith('.js'));

for (const file of selectorFiles) {
	const selector = require(`./selector/${file}`);

	client.selectors.set(selector.name, selector);
}

client.on('interactionCreate', async interaction => {

	if (interaction.isCommand()) {
		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction);
		}
		catch (error) {
			console.error(error);
		}
	}
	else if (interaction.isSelectMenu()) {
		const selector = client.selectors.get(interaction.customId);

		if (!selector) return;

		try {
			await selector.execute(interaction);
		}
		catch (error) {
			console.error(error);
		}

	}

});

client.login(process.env.token);