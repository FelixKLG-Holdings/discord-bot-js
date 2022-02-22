module.exports = {
	name: 'support',
	async execute(interaction) {
		for (const addon of interaction.values) {
			if (addon === 'lsac') {
				await interaction.reply({ content: 'https://www.gmodstore.com/help/tickets/create/addon/7648', ephemeral: true });
			}
			else if (addon === 'swiftac') {
				await interaction.reply({ content: 'https://www.gmodstore.com/help/tickets/create/addon/3642', ephemeral: true });
			}
			else if (addon === 'screengrabs') {
				await interaction.reply({ content: 'https://www.gmodstore.com/help/tickets/create/addon/5061', ephemeral: true });
			}
			else if (addon === 'hitreg') {
				await interaction.reply({ content: 'https://www.gmodstore.com/help/tickets/create/addon/5340', ephemeral: true });
			}
			else if (addon === 'workshopdl') {
				await interaction.reply({ content: 'https://www.gmodstore.com/help/tickets/create/addon/4868', ephemeral: true });
			}
			else if (addon === 'sexyerrors') {
				await interaction.reply({ content: 'https://www.gmodstore.com/help/tickets/create/addon/4892', ephemeral: true });
			}
		}
	},
};