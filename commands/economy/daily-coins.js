const mongo = require('../../functions/mongo')
const math = require('../../functions/math')

var claimed = []

console.log("TESTEO DESDE DAILYCOINS")

module.exports = {
  commands: ['dailycoins', 'dc'],
  description: 'Te da monedas una vez al día, estas se pueden usar en la tienda (tienda aun no disponible)',
  callback: async (message) => {
    const target = message.author

    var newCoins = 100
    if(math.luckyStrike(10)){
      newCoins = newCoins * 2
    }

    if(claimed.includes(target.id)){
      message.channel.send(`Ya has reclamado tu recompensa de hoy, vuelve a intentarlo mañana`)
      return
    }

    claimed.push(target.id)
    
    message.channel.send(`Añadidas **${newCoins}** Padoru Coins a la cuenta de ${target.username}`)

    mongo.addCoins(target.id, newCoins)

    return
  }
}