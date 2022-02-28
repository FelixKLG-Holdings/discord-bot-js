const { SlashCommandBuilder } = require('@discordjs/builders');
const ms = require('ms');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mute-member')
		.setDescription('Mutes a member')
		.addUserOption(option =>
			option.setName('member')
				.setDescription('The member that will be muted')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('The reason this member is being muted')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('time')
				.setDescription('How long this user is to be muted')
				.setRequired(true))
		.setDefaultPermission(false),
	async execute(interaction) {

		const memberPerms = await interaction.memberPermissions.has('MUTE_MEMBERS');
		const mutedRole = process.env.MUTED_ROLE;
		const target = await interaction.options.getMember('member');
		const reason = await interaction.options.getString('reason');
		const time = await interaction.options.getString('time');

		if (interaction.options) {
			try {
				if (memberPerms) {
					if (target == null) {
						interaction.reply({ content: 'This user is no longer in the server.', ephemeral: true });
						return;
					}
					else if (target.user.bot) {
						interaction.reply({ content: 'I will not mute my own kind!', ephemeral: true });
						return;
					}
					else if (!target.manageable) {
						interaction.reply({ content: 'It seems I can not mute this user! Make sure my rank is higher.', ephemeral: true });
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
			if (time == null) {
				target.send('You have been muted in ' + interaction.guild.name + ' permanently.' + '\nReason: ' + reason);
			}
			else if (ms(time) <= 0) {
				target.send('You have been muted in ' + interaction.guild.name + ' permanently.' + '\nReason: ' + reason);
			}
			else {
				const timeMs = ms(time);
				target.send('You have been muted in ' + interaction.guild.name + ' for ' + ms(timeMs, { long: true }) + '.' + '\nReason: ' + reason);
			}
			target.roles.add(mutedRole, 'User was muted because ' + reason);
		}

		if (time == null) {
			// empty
		}
		else if (ms(time) > 0) {
			setTimeout(async function() {
				target.roles.remove(mutedRole, 'User mute time is up');
				console.log('Unmuted ' + target.id);
			}, ms(time));
		}
		const timeMs = ms(time);
		interaction.reply({ content: 'User was muted for ' + ms(timeMs, { long: true }) + '.', ephemeral: true });
	},
};