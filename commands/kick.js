const { SlashCommandBuilder } = require('@discordjs/builders');
const { DMChannel, Message, Guild } = require('discord.js');

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
		.setDefaultPermission(true),
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
				kickTimeout();
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
				target.kick(reason);
			}, 1000);
		}

		await kickTimeout();
		await sendMsg();
		interaction.reply({ content: 'User was kicked successfully', ephemeral: true });
	},
};