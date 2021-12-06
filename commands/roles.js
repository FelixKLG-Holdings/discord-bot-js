const { SlashCommandBuilder } = require('@discordjs/builders');
const { captureException } = require('@sentry/node');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

const LinkAPIKEY = process.env.API_KEY;
const LinkURL = process.env.API_URL;
const SentryEnabled = process.env.SENTRY_ENABLED;


module.exports = {
	data: new SlashCommandBuilder()
		.setName('roles')
		.setDescription('test'),
	async execute(interaction) {

		const apiHTTP = await axios.create({
			baseURL: LinkURL,
			timeout: 3000,
			headers: { 'key': LinkAPIKEY },
		});

		async function getPurchases() {
			return await apiHTTP.get('api/purchases', {
				data: {
					'id': interaction.user.id,
				},
			}).then(async function(response) {
				return await response.data;
			}).catch(async function(error) {
				if (error.response.status === 404) {
					await interaction.reply('You are not linked');
				}
				else if (SentryEnabled) {
					await captureException(error);
				}
			});
		}

		const userPurchases = await getPurchases();

		async function assignRoles() {

			const commandUser = await interaction.member;

			console.log(userPurchases);

			for (const purchase of await userPurchases) {
				if (purchase === 7648) {
					await commandUser.roles.add('884061162482847765');
				}
				else if (purchase === 3642) {
					await commandUser.roles.add('884060408946757663');
				}
				else if (purchase === 5061) {
					await commandUser.roles.add('889306784551026780');
				}
				else if (purchase === 5340) {
					await commandUser.roles.add('884060954294386698');
				}
				else if (purchase === 4868) {
					await commandUser.roles.add('884060628128497716');
				}
				else if (purchase === 4892) {
					await commandUser.roles.add('884060823205609473');
				}
			}
		}

		async function createEmbed() {

			await assignRoles();

			const embed = new MessageEmbed()
				.setTitle('Support Roles')
				.setDescription('Your support roles have been assigned.\nYou can now access support for your purchases')
				.setColor('#52A8F2');

			if (userPurchases === 'error') {
				await embed.addField('Error', 'If you\'re seeing this message an error has occurred, please contact someone so this can be resolved');
			}

			await interaction.reply({ embeds: [embed] });

		}

		await createEmbed();

	},
};