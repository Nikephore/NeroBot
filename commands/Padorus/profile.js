const fs = require('fs')
const pr = require('../../databaseFunctions/dbProfile')
const npr = require('../../databaseFunctions/dbNewProfile')
const st = require('../../databaseFunctions/dbSkillTree')
const fil = require ('../../functions/filter')
const Discord = require("discord.js")


module.exports = {
  commands: ['profile', 'pr'],
  description: 'Command to see your profile. Short ver. %pr',
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

    var syba = 'Locked · ❌'
    if(sktr.sybarite.syba){
      syba = 'Unlocked · ✅'
    }

    var prmsg = new Discord.MessageEmbed()
    .setAuthor(target.username)
    .setColor('BLUE')
    .setThumbnail('https://cdn.discordapp.com/attachments/901798915425321000/901799120740704276/PADORUorg.png')
    .addField('\u200B',`**Padorupedia:** ${prof.padorupedia.length}/${padoruBaseList.length}\n**PadoruCoins** ${fil.nFormatter(prof.padoruCoins)} :coin:`)
    .addField('---Skills---', `**Rolls LV ${sktr.prolls.level}**\nNumber of rolls · ${sktr.prolls.numrolls}\n**Lucky Strike LV ${sktr.problucky.level}**\nProbability · ${luck.toFixed(2)}%\n**Daily Coins LV ${sktr.dailycoins.level}**\nNumber of coins · ${sktr.dailycoins.dc}\n**Attack LV ${sktr.attack.level}**\nDamage · ${sktr.attack.value} :heart:\n**Sybarite Mode**\n${syba}`)
    .addField('\u200B',`**Tickets** · ${nprof.tickets} 🎟️`)
    

    message.channel.send(prmsg)
  }
}