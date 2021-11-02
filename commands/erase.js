const economy = require('../economy')

module.exports = {
  commands: ['erase'],
  callback: async (message, arguments, text) => {

    const padorupedia = await economy.myPadorus(message.author.id)
    const erase = await economy.erase(message.author.id, padorupedia)
    message.channel.send(`Tus datos han sido borrados correctamente (comando debug)`)
  },  
}