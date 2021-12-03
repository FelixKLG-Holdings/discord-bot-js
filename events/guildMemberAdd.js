const { MessageEmbed } = require('discord.js');
const axios = require('axios');


const LinkAPIKEY = process.env.API_KEY;
const LinkURL = process.env.API_URL;
const VerifiedMEMBERROLE = process.env.VERIFIED_MEMBER_ROLE;
const WelcomeCHANNEL = process.env.WELCOME_CHANNEL;

module.exports = {
	name: 'guildMemberAdd',
	async execute(member) {

		const WelcomeMessage = new MessageEmbed()
			.setTitle('Welcome')
			.setDescription('Welcome to the support server for Leystryku\'s GmodStore addons.\nIf you are not already verified please read <#884069163306479647>.')
			.setColor('#85F2F2')
			.addField('Please remember to read the rules', '<#884050630241550376>');

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
				await member.guild.channels.cache.get(WelcomeCHANNEL).send({ content: `<@${member.user.id}>`, embeds: [WelcomeMessage] });
				await console.log('test');
			}
		}).catch(function(error) {
			console.error(error);
		});
	},
};