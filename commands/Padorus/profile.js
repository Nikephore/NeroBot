const fs = require('fs')
const pr = require('../../databaseFunctions/dbProfile')
const npr = require('../../databaseFunctions/dbNewProfile')
const st = require('../../databaseFunctions/dbSkillTree')
const Discord = require("discord.js")


module.exports = {
  commands: ['profile', 'pr'],
  description: 'Command to see your profile',
  callback: async (message) => {
    const target = message.mentions.users.first() || message.author

    const jsonString = fs.readFileSync('./json/padoru.json')
    const padoru = JSON.parse(jsonString)
    var padoruBaseList = []

    for(var i in padoru){
      padoruBaseList.push(padoru[i])
    }

    const prof = await pr.getProfile(target.id, target.username)
    const nprof = await npr.getNewProfile(target.id, target.username)
    const sktr = await st.getSkillTree(target.id, target.username)

    var luck = 1/sktr.problucky.prob * 100

    var syba = 'Locked ❌'
    if(sktr.sybarite){
      syba = 'Unlocked ✅'
    }

    var prmsg = new Discord.MessageEmbed()
    .setAuthor(target.username)
    .setColor('BLUE')
    .setThumbnail('https://cdn.discordapp.com/attachments/901798915425321000/901799120740704276/PADORUorg.png')
    .addField('\u200B',`**Padorupedia:** ${prof.padorupedia.length}/${padoruBaseList.length}\n**PadoruCoins:** ${prof.padoruCoins} :coin:`)
    .addField('---Skills---', `**Rolls LV ${sktr.prolls.level}**\nNumber of rolls: ${sktr.prolls.numrolls}\n**Lucky Strike LV ${sktr.problucky.level}**\nProbability: ${luck}%\n**Daily Coins LV ${sktr.dailyCoins.level}**\nNumber of coins: ${sktr.dailyCoins.dc}\n**Sybarite Mode**\n${syba}`)
    

    message.channel.send(prmsg)
  }
}