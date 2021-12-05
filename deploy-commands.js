require('dotenv').config();
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
// const { Client, Intents } = require('discord.js');

const ClientID = process.env.CLIENT_ID;
const GuildID = process.env.GUILD_ID;
const Token = process.env.DISCORD_TOKEN;
// const supportRole = process.env.SUPPORT_ROLE;

// const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
// client.login(Token).then(() => {
// 	console.log('Client Authenticated');
// });

// const permissions = [
// 	{
// 		id: supportRole,
// 		type: 'ROLE',
// 		permission: true,
// 	},
// ];

const commands = [];

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(Token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(ClientID, GuildID),
			{ body: commands },
		);
		console.log('Successfully reloaded application (/) commands.');
	}
	catch (error) {
		console.error(error);
	}
})();

// client.once('ready', async client => {
// 	if (!client.guilds) await client.guilds.fetch();
// 	const liveCommands = await client.guilds.cache.get(GuildID)?.commands.fetch();
//
// 	for (const liveCommand of liveCommands) {
// 		await console.log(liveCommand.json());
// 	}
// 	await client.destroy();
// })