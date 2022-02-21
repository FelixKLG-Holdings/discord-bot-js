const { SlashCommandBuilder } = require('@discordjs/builders');
const { captureException } = require('@sentry/node');

const SentryEnabled = process.env.SENTRY_ENABLED;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('force-roles')
		.setDescription('Force run the roles command on a select user.')
		.addUserOption(option =>
			option.setName('member')
				.setDescription('The member to force roles upon.')
				.setRequired(true))
		.setDefaultPermission(false),
	async execute(interaction) {

		const mentionedUser = await interaction.options.getUser('member').id;


		await interaction.reply({ content: 'User was kicked successfully', ephemeral: true });
	},
};