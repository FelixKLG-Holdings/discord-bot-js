const axios = require('axios');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { captureException } = require('@sentry/node');

const LinkAPIKEY = process.env.API_KEY;
const LinkURL = process.env.API_URL;
const SentryEnabled = process.env.SENTRY_ENABLED;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gmodstore')
		.setDescription('Get the mentioned user\'s attached GmodStore account')
		.addUserOption(option =>
			option.setName('member')
				.setDescription('The user you want the GmodStore URL of.')
				.setRequired(true)),
	async execute(interaction) {

		const httpClient = await axios.create({
			baseURL: LinkURL,
			timeout: 3000,
			headers: { 'Key': LinkAPIKEY },
		});

		const mentionedUser = await interaction.options.getUser('member').id;

		await httpClient.get('api/steamid', {
			data: {
				'id': mentionedUser,
			},
		}).then(async function(response) {
			const GmodStoreURL = `https://gmodstore.com/users/${response.data.id}`;
			await interaction.reply({ content: GmodStoreURL, ephemeral: true });
		}).catch(async function(error) {
			if (error.response.status === 404) {
				await interaction.reply({ content: 'User is not linked.', ephemeral: true });
			}
			else if (SentryEnabled) {captureException(error);}

		});
	},
};