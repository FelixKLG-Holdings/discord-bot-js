const { MessageEmbed } = require('discord.js');
const { userMention, channelMention } = require('@discordjs/builders');
const { captureException } = require('@sentry/node');
const axios = require('axios');

const SentryEnabled = process.env.SENTRY_ENABLED;
const LinkAPIKEY = process.env.API_KEY;
const LinkURL = process.env.API_URL;
const VerifiedMEMBERROLE = process.env.VERIFIED_MEMBER_ROLE;
const WelcomeCHANNEL = process.env.WELCOME_CHANNEL;

module.exports = {
	name: 'guildMemberAdd',
	async execute(member) {

		const WelcomeMessage = new MessageEmbed()
			.setTitle('Welcome')
			.setDescription(`Welcome to the support server for Leystryku's GmodStore addons.\nIf you are not already verified please read ${channelMention('884069163306479647')}`)
			.setColor('#85F2F2')
			.addField('Please remember to read the rules', channelMention('884050630241550376'));

		const httpClient = axios.create({
			baseURL: LinkURL,
			timeout: 3000,
			headers: { 'Key': LinkAPIKEY },
		});

		const guildMemberAdded = member.user.id;

		await httpClient.get('api/steamid', {
			data: {
				'id': guildMemberAdded,
			},
		}).then(async function(response) {
			if (response.status === 200) {
				await member.roles.add(VerifiedMEMBERROLE);
				await member.guild.channels.cache.get(WelcomeCHANNEL).send({ content: userMention(member.user.id), embeds: [WelcomeMessage] });
			}
		}).catch(async function(error) {
				await member.guild.channels.cache.get(WelcomeCHANNEL).send({ content: userMention(member.user.id), embeds: [WelcomeMessage] });
				if (SentryEnabled && error.response.status !== 400) {
					captureException(error);
				}
		});
	},
};