const axios = require('axios');
const { slug } = require('cuid');

const gmsAPI = axios.create({
	baseURL: 'https://gmodstore.com/api/v2/',
	timeout: 3000,
	headers: { 'Authorization': `Bearer ${process.env.GMS_APIKEY}` },
});

async function getCoupons(addonId) {
	console.log(111)
	return await gmsAPI.get(`addons/${addonId}/coupons`);
}

async function createCoupon(addonId, steamId) {
	return await gmsAPI.post(`addons/${addonId}/coupons`, {
		code: slug(),
		percent: 25,
		max_uses: 1,
		expires_at: new Date(Date.now() + 1123200000).toISOString(),
		bound_user_id: steamId,
	});
}

module.exports = { getCoupons, createCoupon };