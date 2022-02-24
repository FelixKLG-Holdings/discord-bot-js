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
		const target = await interaction.options.getMember('member');
		let reason;

		if (interaction.options.getString('reason') === null) {
			reason = 'No reason provided';
		}
		else {
			reason = interaction.options.getString('reason');
		}

		try {
			if (memberPerms) {
				if (target == null) {
					interaction.reply({ content: 'This user is no longer in the server.', ephemeral: true });
					return;
				}
				else if (target.user.bot) {
					interaction.reply({ content: 'I will not kick my own kind!', ephemeral: true });
					return;
				}
				else if (!target.kickable || !target.manageable) {
					interaction.reply({ content: 'It seems I can not kick this user! Make sure my rank is higher.', ephemeral: true });
					return;
				}
				else {
					kickTimeout();
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

		async function sendMsg() {
			target.send('You have been kicked from ' + interaction.guild.name + '\nReason: ' + reason);
		}
		async function kickTimeout() {
			setTimeout(function kickMember() {
				// target.kick(reason);
			}, 300);
		}

		await kickTimeout();
		await sendMsg();
		interaction.reply({ content: 'User was kicked successfully', ephemeral: true });
	},
};