const mongo = require('../../databaseFunctions/dbProfile')
const newMongo = require ('../../databaseFunctions/dbNewProfile')
const st = require('../../databaseFunctions/dbSkillTree')
const math = require('../../functions/math')
const Duration = require('humanize-duration')
const schedule = require('node-schedule')

/**
 * Se ejecuta cada medianoche
 * Reseteo de %dailycoins
 */
schedule.scheduleJob('0 0 * * *', () => { resetDaily() })

async function resetDaily() {
  mongo.resetDaily()
}


module.exports = {
  commands: ['dailycoins', 'dc'],
  description: 'Te da monedas una vez al día, estas se pueden usar en la tienda (tienda aun no disponible)',
  callback: async (message) => {
    const target = message.author

    const sk = await st.getSkillTree(message.author.id, message.author.username)

    var newCoins = sk.dailycoins.dc

    if(math.luckyStrike(10)){
      newCoins = newCoins * 2
    }

    let remaining = Duration(math.minsToMidnight() * 60000, {units: ['h', 'm'], maxDecimalPoints: 0, language: 'en'})

    const claimed = await mongo.getProfile(target.id)

    if(claimed.daily === 0){
      message.channel.send(`You have already claimed your reward today, try again tomorrow.\n\n**${remaining}** for the next claim.`)
      return
    }

    console.log("DailyCoins canjeado por " + message.author.username)

    await mongo.claimDaily(target.id)
    
    message.channel.send(`Added **${newCoins}** Padoru Coins and **1** 🎟️ to the ${target.username}'s account`)

    mongo.addCoins(target.id, newCoins)

    newMongo.addTicket(target.id, 1)

    return
  }
}

