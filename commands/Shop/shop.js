const fs = require('fs')
const st = require('../../databaseFunctions/dbSkillTree')
const profile = require('../../databaseFunctions/dbProfile')
const Discord = require('discord.js')

module.exports = {
	commands: ['shop'],
	description: 'Shop where you can see the upgrades and items that will help you to obtain Padorus',
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
		shopmsg.setTitle(`Your Coins: ${pr.padoruCoins} :coin:`)
		shopmsg.setColor('GREEN')

		shopmsg.setDescription(`To upgrade your skills use the command
    %buy <skill ID>`)

		shopmsg.addField(
			'---Skills---',
			`**${skills.prolls.id} · Rolls LV ${sk.prolls.level}**
${sk.prolls.level !== skills.prolls.maxlv ? 'Next level: ' + skills.prolls.price[sk.prolls.level] : 'Max level reached!'} :coin:
**${skills.problucky.id} · Lucky Strike LV ${sk.problucky.level}**
${sk.problucky.level !== skills.problucky.maxlv ? 'Next level: ' + skills.problucky.price[sk.problucky.level] : 'Max level reached!'} :coin:
**${skills.dailycoins.id} · Daily Coins LV ${sk.dailycoins.level}**
${sk.dailycoins.level !== skills.dailycoins.maxlv ? 'Next level: ' + skills.dailycoins.price[sk.dailycoins.level] : 'Max level reached'} :coin:
**${skills.sybarite.id} · Sybarite Mode** 
${sk.sybarite.syba === false ? 'Unlock: ' + skills.sybarite.price[sk.problucky.level] + ' :coin:' : 'Unlocked!'}`)

		message.channel.send(shopmsg)

	}
}