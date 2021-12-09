const mongo = require('../../databaseFunctions/dbProfile')
const newMongo = require ('../../databaseFunctions/dbNewProfile')
const st = require('../../databaseFunctions/dbSkillTree')
const math = require('../../functions/math')
const Duration = require('humanize-duration')
const schedule = require('node-schedule')

/*Todos los dias a las 00 se reinicia el array de usuarios
que han reclamado la recompensa diaria*/
schedule.scheduleJob('0 0 * * *', () => { claimed.length = 0 }) // run everyday at midnight

var claimed = []

module.exports = {
  commands: ['dailycoins', 'dc'],
  description: 'Te da monedas una vez al día, estas se pueden usar en la tienda (tienda aun no disponible)',
  callback: async (message) => {
    const target = message.author

    const sk = await st.getSkillTree(message.author.id, message.author.username)

    var newCoins = sk.dailyCoins.dc

    if(math.luckyStrike(10)){
      newCoins = newCoins * 2
    }

    let remaining = Duration(math.minsToMidnight() * 60000, {units: ['h', 'm'], maxDecimalPoints: 0, language: 'es'})
    
    if(claimed.includes(target.id)){
      message.channel.send(`Ya has reclamado tu recompensa de hoy, vuelve a intentarlo mañana.\n\n**${remaining}** para el proximo reclamo.`)
      return
    }

    claimed.push(target.id)
    
    message.channel.send(`Añadidas **${newCoins}** Padoru Coins y 1🎟️ a la cuenta de ${target.username}`)

    mongo.addCoins(target.id, newCoins)

    newMongo.addTicket(target.id, target.username)


    return
  }
}