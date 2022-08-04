const axios = require('axios');
const { captureException } = require('@sentry/node');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { slug } = require('cuid');

const SentryEnabled = process.env.SENTRY_ENABLED;
const LinkURL = process.env.API_URL;
const LinkAPIKEY = process.env.API_KEY;
const GMS_APIKEY = process.env.GMS_APIKEY;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coupon')
		.setDescription('Get a coupon for LSAC if you have a qualifying purchase.'),
	async execute(interaction) {

		const gmsHTTP = await axios.create({
			baseURL: 'https://api.gmodstore.com/v2/',
			timeout: 3000,
			headers: { 'Authorization': `Bearer ${GMS_APIKEY}` },
		});

		const apiHTTP = await axios.create({
			baseURL: LinkURL,
			timeout: 3000,
			headers: { 'Key': LinkAPIKEY },
		});

		async function purchases() {
			return await apiHTTP.post('api/purchases', {
				'id': interaction.user.id,
				},
			).then(async function(response) {
				return await response.data;
			}).catch(async function(error) {
				if (error.response.status === 404) {
					await interaction.reply({ content: 'You are not linked.', ephemeral: true });
				}
				else if (SentryEnabled) {
					captureException(error);
				}
			});
		}

		async function createCoupon() {

			async function getSID() {
				return await apiHTTP.post('api/steamid', {
						'id': await interaction.user.id,
				}).then(async function(response) {
					return response.data.id;
				}).catch(async function(error) {
					if (error.response.status === 404) {
						await interaction.reply({ content: 'User is not linked.', ephemeral: true });
					}
					else if (SentryEnabled) {
						captureException(error);
					}
				});
			}

			const boundUser = await getSID();

			const coupons = await gmsHTTP.get('addons/7648/coupons')
				.then(async function(response) {
					for (const coupon of response.data.data) {
						if (coupon.bound_user_id === await boundUser) {
							return coupon['code'];
						}
					}
				}).catch(async function(error) {
					if (SentryEnabled) {
						captureException(error);
					}
				});
			if (coupons) {
				return coupons;
			}
			else {
				return await gmsHTTP.post('addons/7648/coupons', {
					code: slug(),
					percent: 25,
					max_uses: 1,
					expires_at: new Date(Date.now() + 10000e5).toISOString(),
					bound_user_id: boundUser,
				}).then(async function(response) {
					return response.data['code'];
				}).catch(async function(error) {
					if (SentryEnabled) {
						captureException(error);
					}
				});
			}

		}

		async function createEmbed() {

			const Embed = await new MessageEmbed()
				.setTitle('LSAC Coupon')
				.setDescription('You can use the below coupon for up to %25 off of LSAC.');

			await Embed.addField('Code', await createCoupon(), false);
			return Embed;
		}

		const userPurchases = await purchases();

		if (await userPurchases.includes(7648)) {
			await interaction.reply({ content: 'You already own LSAC, no coupon will be generated.', ephemeral: true });
		}
		else if (await userPurchases.includes(3642) || await userPurchases.includes(4976)) {
			await interaction.reply({ embeds: [await createEmbed()], ephemeral: true });
		}
		else {
			await interaction.reply({ content: 'Sorry but you don\'t have any qualifying purchases.', ephemeral: true });
		}

	},
};