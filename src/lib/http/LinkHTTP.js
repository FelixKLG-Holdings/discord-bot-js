const axios = require('axios');

const apiHTTP = axios.create({
	baseURL: process.env.API_URL,
	timeout: 3000,
	headers: { 'key': process.env.API_KEY },
});

async function getPurchases(discordId) {
	return await apiHTTP.get('api/purchases', {
		data: {
			id: discordId,
		},
	});
}

async function getSteamId(discordId) {
	return await apiHTTP.get('api/steamid', {
		data: {
			id: discordId,
		},
	});
}

module.exports = { getPurchases, getSteamId };