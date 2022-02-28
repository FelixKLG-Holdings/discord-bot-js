const { SlashCommandBuilder } = require('@discordjs/builders');
const ms = require('ms');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmute-member')
		.setDescription('Unmutes a member')
		.addUserOption(option =>
			option.setName('member')
				.setDescription('The member that will be unmuted')
				.setRequired(true))
		.setDefaultPermission(false),
	async execute(interaction) {

		const memberPerms = await interaction.memberPermissions.has('MUTE_MEMBERS');
		const mutedRole = process.env.MUTED_ROLE;
		const target = await interaction.options.getMember('member');

		if (interaction.options) {
			try {
				if (memberPerms) {
					if (target == null) {
						interaction.reply({ content: 'This user is no longer in the server.', ephemeral: true });
						return;
					}
					else if (target.user.bot) {
						interaction.reply({ content: 'I can not mute bots so how can I unmute them?', ephemeral: true });
						return;
					}
					else if (!target.manageable) {
						interaction.reply({ content: 'It seems I can not unmute this user! Make sure my rank is higher.', ephemeral: true });
						return;
					}
					else {
						muteMember();
					}
				}
				else {
					interaction.reply({ content: 'You do not have permission', ephemeral: true });
					return;
				}
			}
			catch (e) {
				console.error(e);
			}
		}
		async function muteMember() {

			target.roles.remove(mutedRole, 'User was unmuted');
		}

		interaction.reply({ content: 'User was unmuted', ephemeral: true });
	},
};