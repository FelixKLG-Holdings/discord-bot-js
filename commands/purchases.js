const axios = require('axios');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Sentry = require('@sentry/node');

const LinkAPIKEY = process.env.API_KEY;
const LinkURL = process.env.API_URL;
const SentryEnabled = process.env.SENTRY_ENABLED;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purchases')
		.setDescription('Get mentioned user\'s GmodStore purchases.')
		.addUserOption(option =>
			option.setName('member')
				.setDescription('The user you want the purchases of.')
				.setRequired(true))
		.setDefaultPermission(false),
	async execute(interaction) {

		const httpClient = axios.create({
			baseURL: LinkURL,
			timeout: 3000,
			headers: { 'Key': LinkAPIKEY },
		});

		const mentionedUser = interaction.options.getUser('member');

		async function purchaseEmbed(purchases) {


			const Embed = new MessageEmbed()
				.setTitle('User Purchases')
				.setDescription(`The purchases of ${mentionedUser.tag}`)
				.setColor('#BF8AE0');

			for (const addon of purchases) {
				if (addon === 7648) {
					Embed.addField('Ley\'s Serverside AntiCheat', 'https://www.gmodstore.com/market/view/7648/', false);
				}
				else if (addon === 3642) {
					Embed.addField('SwiftAC', 'https://www.gmodstore.com/market/view/3642/', false);
				}
				else if (addon === 5061) {
					Embed.addField('LeyScreenGrabs', 'https://www.gmodstore.com/market/view/5061/', false);
				}
				else if (addon === 5340) {
					Embed.addField('LeyHitReg', 'https://www.gmodstore.com/market/view/5340/', false);
				}
				else if (addon === 4892) {
					Embed.addField('LeySexyErrors', 'https://www.gmodstore.com/market/view/4892/', false);
				}
				else if (addon === 4868) {
					Embed.addField('LeyWorkshopDLs', 'https://www.gmodstore.com/market/view/4868/', false);
				}
			}

			return Embed;
		}


		await httpClient.get('api/purchases', {
			data: {
				'id': mentionedUser.id,
			},
		}).then(async function(response) {
			await interaction.reply({ embeds: [await purchaseEmbed(response.data)], ephemeral: true });
		}).catch(async function(error) {
			if (error.response.status === 404) {
				await interaction.reply({ content: 'User is not linked.', ephemeral: true });
			}
			else if (SentryEnabled) {Sentry.captureException(error);}
		});
	},
};