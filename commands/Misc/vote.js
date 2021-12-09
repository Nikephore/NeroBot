const mongo = require('../../databaseFunctions/dbNewProfile')

module.exports = {
    commands: ['vote'],
    description: 'Comando para votar por Nero en la página top.gg',
    callback: async (message) => {

      const rolls = await mongo.myRolls(message.author.id, message.author.username)
  
      message.channel.send(`**${rolls} rolls available**\n\nVote for Nero every 12 hours at the link below to obtain more rolls.\nhttps://top.gg/bot/442790194555650048/vote`)
    },  
  }