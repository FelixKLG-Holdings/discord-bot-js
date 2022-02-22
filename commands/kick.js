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

		const memberPerms = await interaction.memberPermissions.has('KICK_MEMBERS');
		const target = await interaction.options.getUser('member');

		try {
			if (memberPerms) {
				kickMember();
			}
			else {
				interaction.reply({ content: 'You do not have permission', ephemeral: true });
			}
		}
		catch (e) {
			console.error(e);
		}

		async function kickMember() {
			try {
				target.kick('Random');
			}
			catch (e) {
				console.error(e);
			}
		}

		interaction.reply({ content: 'User was kicked successfully', ephemeral: true });
	},
};