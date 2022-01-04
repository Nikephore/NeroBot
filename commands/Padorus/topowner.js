const fs = require('fs')
const math = require('../../functions/math')
const profile = require('../../databaseFunctions/dbProfile')
const padList = require('../../databaseFunctions/dbPadoru')
const Discord = require("discord.js")

module.exports = {
    commands: ['topowner', 'to'],
    description: 'Comando para votar por Nero en la página top.gg',
    callback: async (message, arguments) => {

      var owners = await padList.allOwners()

      const unique = owners.filter((v,i,a)=>a.findIndex(t=>(t.owner.userId === v.owner.userId))===i)

      var freq = []

      unique.forEach(element => freq.push(owners.filter((obj) => obj.owner.userId === element.owner.userId).length))
      
      const total = []

      var i = 0
      for (e in unique){
        total.push({ow: unique[i].owner, fr: freq[i]})
        i++
      }

      total.sort((a,b) => (a.fr < b.fr) ? 1 : ((b.fr < a.fr) ? -1 : 0))

      embed = new Discord.MessageEmbed()
        .setAuthor("🏆 Top 10 Padoru Owners 🏆")
        .setColor('AQUA')

      //Situamos los padorus en el embed y enviamos el mensaje
      var title = ''
    
      for(i = 0; (i<10) && (total[i] !== undefined); i++) {
        title = title + '\n`' + (i+1) + '`  **' + total[i].ow.username +  '** | ' + total[i].fr + ' '
      }

      embed.addField('\u200B', title)
  
      message.channel.send(embed)
    },  
  }