const axios = require('axios');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { captureException } = require('@sentry/node');

const LinkURL = process.env.API_URL;
const LinkAPIKEY = process.env.API_KEY;
const SentryEnabled = process.env.SENTRY_ENABLED;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('force-roles')
		.setDescription('Force run the roles command on a select user.')
		.addUserOption(option =>
			option.setName('member')
				.setDescription('The member to force roles upon.')
				.setRequired(true))
		.setDefaultPermission(false),
	async execute(interaction) {

		const apiHTTP = await axios.create({
			baseURL: LinkURL,
			timeout: 3000,
			headers: { 'key': LinkAPIKEY },
		});

		const mentionedUser = await interaction.options.getUser('member').id;

		async function getPurchases() {
			return await apiHTTP.get('api/purchases', {
				data: {
					'id': await mentionedUser,
				},
			}).then(async function(response) {
				return await response.data;
			}).catch(async function(error) {
				if (error.response.status === 404) {
					await interaction.reply('User is not linked.');
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
		await assignRoles();
		await interaction.reply({ content: 'Roles assigned to user', ephemeral: true });
	},
};