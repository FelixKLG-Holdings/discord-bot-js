module.exports = {
	name: 'support',
	async execute(interaction) {
		const addon = interaction.values[0];
		switch (addon) {
		case 'lsac':
			await interaction.reply({ content: 'https://www.gmodstore.com/help/tickets/create/addon/7648', ephemeral: true });
			break;
		case 'swiftac':
			await interaction.reply({ content: 'https://www.gmodstore.com/help/tickets/create/addon/3642', ephemeral: true });
			break;
		case 'screengrabs':
			await interaction.reply({ content: 'https://www.gmodstore.com/help/tickets/create/addon/5061', ephemeral: true });
			break;
		case 'hitreg':
			await interaction.reply({ content: 'https://www.gmodstore.com/help/tickets/create/addon/5340', ephemeral: true });
			break;
		case 'workshopdl':
			await interaction.reply({ content: 'https://www.gmodstore.com/help/tickets/create/addon/4868', ephemeral: true });
			break;
		case 'sexyerrors':
			await interaction.reply({ content: 'https://www.gmodstore.com/help/tickets/create/addon/4892', ephemeral: true });
			break;
		}
	},
};