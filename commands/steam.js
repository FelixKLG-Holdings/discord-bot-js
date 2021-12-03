const axios = require('axios');
const { SlashCommandBuilder } = require('@discordjs/builders');

const LinkAPIKEY = process.env.API_KEY;
const LinkURL = process.env.API_URL;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('steam')
		.setDescription('Get the mentioned user\'s attached Steam™ account')
		.addUserOption(option =>
			option.setName('member')
				.setDescription('The user you want the SteamID of.')
				.setRequired(true)),
	async execute(interaction) {

		const httpClient = axios.create({
			baseURL: LinkURL,
			timeout: 3000,
			headers: { 'Key': LinkAPIKEY },
		});

		const mentionedUser = interaction.options.getUser('member').id;

		await httpClient.get('api/steamid', {
			data: {
				'id': mentionedUser,
			},
		}).then(async function(response) {
			const SteamURL = `https://steamcommunity.com/profiles/${response.data.toString().slice(1)}`;
			await interaction.reply({ content: SteamURL, ephemeral: true });
		});
	},
};