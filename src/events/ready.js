module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		await console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};