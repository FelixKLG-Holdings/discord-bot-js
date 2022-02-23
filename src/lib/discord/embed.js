const { MessageEmbed } = require('discord.js');

function embedBuilder() {
	return new MessageEmbed()
		.setTitle('Leystryku Addons')
		.setColor('#57B7F2')
		.setTimestamp()
		.setFooter({ text: 'Leystryku Discord', iconURL: 'https://leystryku.support/img/icon-static.png' });

}

module.exports = { embedBuilder };