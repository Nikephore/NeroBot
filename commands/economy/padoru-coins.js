const economy = require('../../economy.js')

module.exports = {
  commands: ['padorucoins', 'pc'],
  description: 'Muestra el numero de monedas que tienes',
  callback: async (message) => {
    console.log('comando2')
    const target = message.mentions.users.first() || message.author
    const targetId = target.id

    const coins = await economy.getCoins(targetId)

    message.channel.send(`${target.username} tiene **${coins}** Padoru Coins (PC)`)
  }
}