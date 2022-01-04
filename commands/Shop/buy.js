const fs = require('fs')
const st = require('../../databaseFunctions/dbSkillTree')
const profile = require('../../databaseFunctions/dbProfile')
const Discord = require('discord.js')

module.exports = {
  commands: ['buy'],
  description: 'Command to buy skill upgrades',
  callback: async (message, arguments) => {
    const target = message.author
		const jsonString = fs.readFileSync('./json/skilltree.json')
    const skills = JSON.parse(jsonString)

    const toBuy = parseInt(arguments[0])
    var flag = false

		const sk = await st.getSkillTree(target.id, target.username)

    var skill = [null, sk.prolls, sk.problucky, sk.dailycoins, sk.attack, sk.sybarite]

		const pr = await profile.getProfile(target.id, target.username)

    if(!arguments[0]){
      message.channel.send('Select which upgrade you do want to buy. You can see them with **%shop**')
    }

    for(var s in skills){
      if(skills[s].id === toBuy){

        var mySkill = skills[s]

        if(skill[mySkill.id].level >= mySkill.maxlv){
          message.channel.send('You are at max level')
          return
        }

        const price = mySkill.price[skill[mySkill.id].level]

        let filter = m => m.author.id === message.author.id
          message.channel.send(`You are going to upgrade **${skills[s].name}** to level **${skill[mySkill.id].level + 1}** for **${price} PC**. Are you sure? (yes/no)\n\nYou have **${pr.padoruCoins} PC**`).then(() => {
            message.channel.awaitMessages(filter, {
            max: 1,
            time: 50000,
            errors: ['time']
          })
          .then(message => {
            message = message.first()
            if (message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y') {
              
              console.log(pr.padoruCoins)
              console.log()

              const price = mySkill.price[skill[mySkill.id].level]


              if(skill[mySkill.id].level === mySkill.maxlv){
                message.channel.send('You are at max level')
              }

              if(pr.padoruCoins < price){
                message.channel.send("You don't have enough coins")
                return
              }

              if(mySkill.id === 1){
                st.prollsLvUp(target.id, target.username)

              } else if(mySkill.id === 2){
                st.probluckyLvUp(target.id, target.username)

              } else if(mySkill.id === 3){
                st.dailycoinsLvUp(target.id, target.username)
                
              } else if(mySkill.id === 5){
                st.sybariteUnlock(target.id, target.username)
                
              } else if(mySkill.id === 4){
                st.attackLvUp(target.id, target.username)
              }
              profile.addCoins(target.id, -price, target.username)

              message.channel.send(`https://cdn.discordapp.com/attachments/901798915425321000/902693878501634071/stonks.jpg`)
              

            } else if (message.content.toUpperCase() == 'NO' || message.content.toUpperCase() == 'N') {
              message.channel.send(`Purchase canceled`)
            } else {
              message.channel.send(`That's not a valid answer, bye.`)
            }
          })
          .catch(collected => {
            message.channel.send('Time is over, see you next time.');
          })
        })

        flag = true
      }
    }
    if(!flag){
      return
    }
  }
}