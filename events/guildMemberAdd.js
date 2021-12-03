module.exports = {
	name: 'guildMemberAdd',
	execute(member) {
		console.log('new member');
		console.log(member.user.id);
	},
};