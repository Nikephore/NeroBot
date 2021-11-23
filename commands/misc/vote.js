const mongo = require('../../functions/mongo')

module.exports = {
    commands: ['vote'],
    description: 'Comando para votar por Nero en la página top.gg',
    callback: async (message) => {

      const rolls = await mongo.myRolls(message.author.id, message.author.username)
  
      message.channel.send(`**Tienes ${rolls} rolls disponibles**\n\nPuedes votar por Nero en este enlace cada 12 horas\nhttps://top.gg/bot/442790194555650048/vote`)
    },  
  }