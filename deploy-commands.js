require('dotenv').config();
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.login(process.env.DISCORD_TOKEN).then(() => {
	console.log('Client Authenticated');
});

const commands = [];
const permissions = [];

const folders = fs.readdirSync('./src/commands');

for (const folder of folders) {
	const commandFolders = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFolders) {
		const command = require(`./src/commands/${folder}/${file}`);
		commands.push(command.data.toJSON());
	}
}

const rest = new REST({ version: 9 }).setToken(process.env.DISCORD_TOKEN);

(async () => {
	console.log('Started refreshing application (/) commands.');

	await rest.put(
		Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
		{ body: commands },
	).then(() => console.log('Successfully reloaded application (/) commands.'))
		.catch(console.error);
})();

client.once('ready', async bot => {
	await console.log('Client ready');
	if (!bot.guilds) await bot.guilds.fetch();
	await console.log('Fetched guild');

	//
	// if (!liveCommandPermission) {
	// 	const command = await client.guilds.cache.get(process.env.GUILD_ID)?.commands.fetch(liveCommandID);
	//
	// 	await command.permissions.set({ permissions });
	// }

	console.log('Command permissions pushed');
	await bot.destroy();
});