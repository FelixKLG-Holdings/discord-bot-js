const axios = require('axios');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

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

		const httpClient = await axios.create({
			baseURL: process.env.API_URL,
			timeout: 3000,
			headers: { 'Key': process.env.API_KEY },
		});

		const mentionedUser = await interaction.options.getUser('member');

		async function purchaseEmbed(purchases) {


			const Embed = await new MessageEmbed()
				.setTitle('User Purchases')
				.setDescription(`The purchases of ${mentionedUser.tag}`)
				.setColor('#BF8AE0');

			for (const addon of await purchases) {
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
				'id': await mentionedUser.id,
			},
		}).then(async function(response) {
			await interaction.reply({ embeds: [await purchaseEmbed(response.data)], ephemeral: true });
		}).catch(async function(error) {
			if (error.response.status === 404) {
				await interaction.reply({ content: 'User is not linked.', ephemeral: true });
			}
			else {console.error(error);}
		});
	},
};