const { SlashCommandBuilder } = require('@discordjs/builders');
const LinkURL = process.env.API_URL;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('link')
		.setDescription('Get the URL to link your account to receive support.'),
	async execute(interaction) {
		await interaction.reply(`You can link your account to receive support at ${LinkURL}`);
	},
};