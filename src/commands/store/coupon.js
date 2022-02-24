const { SlashCommandBuilder } = require('@discordjs/builders');
const LinkHTTP = require('../../lib/http/LinkHTTP');
const GmsHTTP = require('../../lib/http/GmodStoreHTTP');
const EmbBuild = require('../../lib/discord/embed');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coupon')
		.setDescription('Get a coupon for LSAC if you have a qualifying purchase.'),
	async execute(interaction) {
		// Get user purchases
		let purchases = await LinkHTTP.getPurchases(interaction.user.id);
		purchases = purchases.data;
		// console.log(purchases);

		async function listCoupons() {
			// Get coupons
			let coupons = await GmsHTTP.getCoupons(7648);
			coupons = coupons.data.data;
			return coupons;
		}

		async function createCode() {
			// Steam ID fetcher
			let steamId = await LinkHTTP.getSteamId(interaction.user.id);
			steamId = steamId.data.id;

			// Check for pre-existing coupons
			for (const coupon of await listCoupons()) {
				if (coupon.bound_user_id === steamId) {
					return coupon.code;
				}
			}

			// If no pre-exising coupon, create coupon.
			const newCoupon = await GmsHTTP.createCoupon(7648, steamId);
			console.log(newCoupon.data);
		}

		async function createResponse() {
			return EmbBuild.embedBuilder().addField('code', await createCode(), false);
		}
		// Coupon eligibility checks
		if (purchases.includes(1648)) {
			interaction.reply({ content: 'You already own LSAC, you are not eligible for a coupon.', ephemeral: true });
		}
		else if (purchases.includes(3642) || purchases.includes(4976)) {
			interaction.reply({ embeds: [await createResponse()], ephemeral: true });
		}
		else {
			interaction.reply({ content: 'You\'re not eligible for any discount, our sympathies.', ephemeral: true });
		}
	},
};