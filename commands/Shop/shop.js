const fs = require('fs')
const st = require('../../databaseFunctions/dbSkillTree')
const profile = require('../../databaseFunctions/dbProfile')
const Discord = require('discord')

module.exports = {
	commands: ['shop'],
	description: 'Shop where you can buy upgrades and items that will help you to obtain Padorus',
	callback: async (message, arguments) => {
		const target = message.author
		const jsonString = fs.readFileSync('./json/skilltree.json')
    const skills = JSON.parse(jsonString)
    var skill = []

		for(var i in skills){
      skill.push(skills[i])
    }

		const sk = await st.getSkillTree(target.id, target.username)
		const pr = await profile.getProfile(target.id, target.username)

		shopmsg = new Discord.MessageEmbed()

		shopmsg.setAuthor('🏛️ Skills Shop')
		shopmsg.setTitle(`Your Coins: ${pr.padoruCoins}`)
		shopmsg.setColor('GREEN')

		shopmsg.setDescription('To upgrade your skills use the command %buy <skill ID>')

		shopmsg.addField(
			'---Skills---',
			`**Rolls LV ${sk.prolls.level}**
			 ${sk.prolls.level === skills.prolls.maxlv ? 'Next level: ' + skills.prolls.price[sk.prolls.level] : 'Max level reached!'} :coin:
			 **Lucky Strike LV ${sk.problucky.level}**
			 ${sk.problucky.level === skills.problucky.maxlv ? 'Next level: ' + skills.problucky.price[sk.problucky.level] : 'Max level reached!'} :coin:
			 **Daily coins LV ${sk.dailyCoins.level}**
			 ${sk.dailyCoins.level === skills.dailycoins.maxlv ? 'Next level: ' + skills.dailycoins.price[sk.dailyCoins.level] : 'Max level reached'} :coin:
			 **Sybarite Mode** ${sk.sybarite === false ? 'Unlock: ' + skills.sybarite.price : 'Unlocked!'}`)

		message.channel.send(shopmsg)

	}
}