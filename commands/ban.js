const { SlashCommandBuilder } = require('@discordjs/builders');

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
        .setDefaultPermission(false),
    async execute(interaction) {

        const memberPerms = await interaction.memberPermissions.has('BAN_MEMBERS');
        const target = await interaction.options.getMember('member');
        const reason = await interaction.options.getString('reason');

        if (interaction.options) {
            try {
                if (memberPerms) {
                    if (target.user.bot) {
                        interaction.reply({ content: 'I will not ban my own kind!', ephemeral: true });
                        return;
                    }
                    else if (!target.bannable) {
                        interaction.reply({ content: 'It seems I can not ban this user! Make sure my rank is higher.', ephemeral: true });
                        return;
                    }
                    else if (!target.manageable) {
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
            target.send('You have been banned from ' + interaction.guild.name + ' permanently.' + '\nReason: ' + reason);
        }
        async function banTimeout() {
            setTimeout(function banMember() {
                target.ban({ reason: reason });
            }, 300);
        }

        await banTimeout();
        await sendMsg();
        interaction.reply({ content: 'User was banned successfully', ephemeral: true });
    },
};