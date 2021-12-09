const mongo = require('../databaseFunctions/dbNewProfile')

function giveTicket(message, rarity) {

	message.react('🎟️')

  mongo.addTicket(message.author.id, message.author.username)

	message.channel.send(`**${message.author.username}** obtained a 🎟️. Use %ticket to spend it.`)
  .then(msg => {
    msg.delete({ timeout: 10000 /*time unitl delete in milliseconds*/});
  })

}

module.exports = {
  giveTicket
}