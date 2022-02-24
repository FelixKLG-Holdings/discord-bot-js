// const { MessageEmbed } = require('discord.js');
// const { userMention, channelMention } = require('@discordjs/builders');
// const LinkHTTP = require('../lib/http/LinkHTTP');
//
// const VerifiedMEMBERROLE = process.env.VERIFIED_MEMBER_ROLE;
// const WelcomeCHANNEL = process.env.WELCOME_CHANNEL;
//
// module.exports = {
// 	name: 'guildMemberAdd',
// 	async execute(member) {
//
// 		const WelcomeMessage = new MessageEmbed()
// 			.setTitle('Welcome')
// 			.setDescription(`Welcome to the support server for Leystryku's GmodStore addons.\nIf you are not already verified please read ${channelMention('884069163306479647')}`)
// 			.setColor('#85F2F2')
// 			.addField('Please remember to read the rules', channelMention('884050630241550376'));
//
//
//
// 		const guildMemberAdded = member.user.id;
//
// 		const sid = await LinkHTTP.getSteamId(member.user.id).catch(() => {console.log(); });
//
// 		console.log(sid);
//
// 		// await httpClient.get('api/steamid', {
// 		// 	data: {
// 		// 		'id': guildMemberAdded,
// 		// 	},
// 		// }).then(async function(response) {
// 		// 	if (response.status === 200) {
// 		// 		await member.roles.add(VerifiedMEMBERROLE);
// 		// 		await member.guild.channels.cache.get(WelcomeCHANNEL).send({ content: userMention(member.user.id), embeds: [WelcomeMessage] });
// 		// 	}
// 		// }).catch(async function(error) {
// 		// 	await member.guild.channels.cache.get(WelcomeCHANNEL).send({ content: userMention(member.user.id), embeds: [WelcomeMessage] });
// 		// 	if (error.response.status !== 404) {
// 		// 		console.error(error);
// 		// 	}
// 		// });
// 	},
// };