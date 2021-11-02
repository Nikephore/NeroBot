const economy = require('../../economy.js')
const math = require('../functions/math.js')

module.exports = {
  commands: ['dailycoins', 'dc'],
  cooldown: 86399, //cooldown de 1 dia
  callback: async (message) => {
    const target = message.author
    const targetId = target.id

    var newCoins = math.randomNumberBetween(25, 50)
    const coins = await economy.addCoins(targetId, newCoins)

    message.channel.send(`Añadidas **${newCoins}** Padoru Coins a la cuenta de ${target.username}`)
  }
}