const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick-member')
		.setDescription('Kicks a member')
		.addUserOption(option =>
			option.setName('member')
				.setDescription('The member that needs a kicking')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('The reason this member is getting kicked')
				.setRequired(false))
		.setDefaultPermission(false),
	async execute(interaction) {

		const mentionedUser = await interaction.options.getUser('member');
		mentionedUser.kick(interaction.options('reason'));


		await interaction.reply({ content: 'User was kicked successfully', ephemeral: true });
	},
};