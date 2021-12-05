require('dotenv').config();
const fs = require('fs');
const Sentry = require('@sentry/node');
const { Client, Collection, Intents } = require('discord.js');

const Token = process.env.DISCORD_TOKEN;
const SentryEnabled = process.env.SENTRY_ENABLED;
const SentryDSN = process.env.SENTRY_DSN;

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
Sentry.init({
	dsn: SentryDSN,
	tracesSampleRate: 1.0,
});


const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

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

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	client.commands.set(command.data.name, command);
}

client.selectors = new Collection();

const selectorFiles = fs.readdirSync('./commands/selector').filter(file => file.endsWith('.js'));

for (const file of selectorFiles) {
	const selector = require(`./commands/selector/${file}`);

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
			if (SentryEnabled) Sentry.captureException(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
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
			if (SentryEnabled) Sentry.captureException(error);
		}

	}

});

client.login(Token).then(() => {
	console.log('Authenticated');
});