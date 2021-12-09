const axios = require('axios');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { captureException } = require('@sentry/node');

const LinkURL = process.env.API_URL;
const LinkAPIKEY = process.env.API_KEY;
const MemberROLE = process.env.VERIFIED_MEMBER_ROLE;
const SentryEnabled = process.env.SENTRY_ENABLED;


module.exports = {
	data: new SlashCommandBuilder()
		.setName('unlink')
		.setDescription('Unlink the mentioned user.')
		.setDefaultPermission(false)
		.addUserOption(option =>
			option.setName('member')
				.setDescription('The user to unlink.')
				.setRequired(true)),
	async execute(interaction) {

		const httpClient = await axios.create({
			baseURL: LinkURL,
			timeout: 3000,
			headers: { 'Key': LinkAPIKEY },
		});

		const mentionedUser = await interaction.options.getUser('member');

		await httpClient.get('api/unlink', {
			data: {
				'id': mentionedUser.id,
			},
		}).then(async function() {
			await mentionedUser.member.roles.remove(MemberROLE);
			await interaction.reply('member unlinked');
		}).catch(async function(error) {
			await interaction.reply('User is not linked');
			if (SentryEnabled) {
				captureException(error);
			}
		});

	},
};