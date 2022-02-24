const { SlashCommandBuilder } = require('@discordjs/builders');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban-member')
        .setDescription('Bans a member')
        .addUserOption(option =>
            option.setName('member')
                .setDescription('The member that will be banned')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason this member is getting banned')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('time')
                .setDescription('How long this user is to be banned')
                .setRequired(false))
        .setDefaultPermission(false),
    async execute(interaction) {

        const memberPerms = await interaction.memberPermissions.has('BAN_MEMBERS');
        const target = await interaction.options.getMember('member');
        const reason = await interaction.options.getString('reason');
        const time = await interaction.options.getString('time');

        if (interaction.options) {
            try {
                if (memberPerms) {
                    if (target == null) {
                        interaction.reply({ content: 'This user is no longer in the server. Are you sure they are not already banned?', ephemeral: true });
                        return;
                    }
                    else if (target.user.bot) {
                        interaction.reply({ content: 'I will not ban my own kind!', ephemeral: true });
                        return;
                    }
                    else if (!target.bannable || !target.manageable) {
                        interaction.reply({ content: 'It seems I can not ban this user! Make sure my rank is higher.', ephemeral: true });
                        return;
                    }
                    else {
                        banTimeout();
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

        async function sendMsg() {
            if (time == null) {
                target.send('You have been banned from ' + interaction.guild.name + ' permanently.' + '\nReason: ' + reason);
            }
            else if (ms(time) <= 0) {
                target.send('You have been banned from ' + interaction.guild.name + ' permanently.' + '\nReason: ' + reason);
            }
            else {
                const timeMs = ms(time)
                target.send('You have been banned from ' + interaction.guild.name + ' for ' + ms(timeMs, { long: true }) + '.' + '\nReason: ' + reason);
            }
        }

        async function banTimeout() {
            setTimeout(function banMember() {
                target.ban({ days: 7, reason: reason });
            }, 300);
        }

        if (time == null) { }
        else if (ms(time) > 0) {
            setTimeout(async function () {
                await interaction.guild.fetch().then(async bans => {
                    if (bans.size == 0) return console.log('Could not unban user as there are no banned users in guild');
                    const bannedUser = bans.fetch(b => b.user.id == target.id);
                    if (!bannedUser) return console.log('User ID ' + target.id + 'is already unbanned');
                    await interaction.guild.members.unban(target.id, 'Ban time is up');
                    console.log('Unbanned ' + target.id)
                });
            }, ms(time));
        }

        await banTimeout();
        await sendMsg();
        interaction.reply({ content: 'User was banned successfully', ephemeral: true });
    },
};