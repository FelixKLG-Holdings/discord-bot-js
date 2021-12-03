const wait = require('util').promisify(setTimeout);
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ticket')
		.setDescription('Get URL to create a GmoodStore support ticket.'),
	async execute(interaction) {
		const addonSelector = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('support')
					.setPlaceholder('Select Addon')
					.addOptions([
						{
							label: 'LSAC',
							description: 'Create a Ley\'s Serverside AntiCheat support ticket.',
							value: 'lsac',
						},
						{
							label: 'SwiftAC',
							description: 'Create a SwiftAC support ticket.',
							value: 'swiftac',
						},
						{
							label: 'LeyScreenGrabs',
							description: 'Create a LeyScreenGrabs support ticket.',
							value: 'screengrabs',
						},
						{
							label: 'HitReg',
							description: 'Create a LeyHitReg support ticket.',
							value: 'hitreg',
						},
						{
							label: 'WorkshopDL',
							description: 'Create a LeysWorkshopDL support ticket.',
							value: 'workshopdl',
						},
						{
							label: 'LeySexyErrors',
							description: 'Create a LeySexyErrors support ticket.',
							value: 'sexyerrors',
						},
					]),
			);
		await interaction.reply({ content: 'Please select the addon you wish to make a ticket for.', ephemeral: true, components: [addonSelector] });
		await wait(15000);
		await interaction.editReply({content: '⏳ Timeout exceeded.', ephemeral: true, components: []})
	},
};