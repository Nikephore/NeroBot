const economy = require('../economy')

module.exports = {
  commands: ['erase'],
  description: 'Borra tu colección de Padorus, por si quieres empezar de 0 ⚠️',
  callback: async (message, arguments, text) => {

    const padorupedia = await economy.myPadorus(message.author.id)
    const erase = await economy.erase(message.author.id, padorupedia)
    message.channel.send(`Tus datos han sido borrados correctamente (comando debug)`)
  },  
}