const fs = require('fs')
const math = require('../../functions/math')
const profile = require('../../databaseFunctions/dbProfile')
const padList = require('../../databaseFunctions/dbPadoru')
const Discord = require("discord.js")
const newProfile = require ('../../databaseFunctions/dbNewProfile')

const schedule = require('node-schedule')

/**
 * Se ejecuta cada semana (miercoles)
 * Reseteo de %padoru
 */
schedule.scheduleJob('0 0 * * 3', () => { endSeason() })

module.exports = {
    commands: ['top'],
    description: 'Command to see the global padorupedia top',
    callback: async (message) => {

      const total = await obtainOwners()

      const position = total.findIndex(e => e.ow.userId === message.author.id) + 1

      embed = new Discord.MessageEmbed()
        .setAuthor("🏆 Top PadoruPedia 🏆")
        .setColor('AQUA')
        .setTitle('On process...')

      //Situamos los padorus en el embed y enviamos el mensaje
      /*
      var title = ''
    
      for(i = 0; (i<20) && (total[i] !== undefined); i++) {
        title = title + '\n`' + (i+1) + '`  **' + total[i].ow.username +  '** | ' + total[i].fr + ' '
      }

      embed.addField('\u200B', title)

      var footer = ""
      if(position === 0){
        footer = "You are not the owner of any Padoru"
      } else {
        footer = `Your position is #${position}`
      }

      embed.setFooter(footer)
      */
      message.channel.send(embed)
    },  
}

async function obtainOwners(){
  var owners = await padList.allOwners()

  var unique = owners.filter((v,i,a)=>a.findIndex(t=>(t.owner.userId === v.owner.userId))===i)

  /**
   * Hacemos que el bot no pueda estar en el top
   */
  unique = unique.filter(e => e.owner.userId !== '442790194555650048')

  var freq = []

  unique.forEach(element => freq.push(owners.filter((obj) => obj.owner.userId === element.owner.userId).length))
      
  const total = []

  var i = 0
  for (e in unique){
    total.push({ow: unique[i].owner, fr: freq[i]})
    i++
  }

  total.sort((a,b) => (a.fr < b.fr) ? 1 : ((b.fr < a.fr) ? -1 : 0))

  return total
}


async function endSeason(){
  const total = await obtainOwners()
  
  var ids = []

  for(i = 0; i < total.length; i++){
    ids.push(total[i].ow.userId)
  }

  console.log(ids)

  //await newProfile.addTicket(ids[0], 100)

  await newProfile.addTicket(ids[1], 75)

  // Puestos del 3 al 5
  const bronze = ids.slice(2,5)
  await newProfile.addTickets(bronze, 50)

  // Puestos del 6 al 10
  const topten = ids.slice(5,10)
  await newProfile.addTickets(topten, 40)

  // Puestos del 11 al 20
  const untiltwenty = ids.slice(10, 20)
  await newProfile.addTickets(untiltwenty, 25)

  // El resto de owners
  const others = ids.slice(20)
  await newProfile.addTickets(others, 10)

  fs.appendFile('guilds.txt', "Tickets repartidos correctamente", (err) => {
    if(err) throw err
  })
}

