const mongo = require('../functions/mongo')

function giveTicket(message, rarity) {

	message.react('🎟️')

  mongo.addTicket(message.author.id, message.author.username, rarity)

	message.channel.send(`${message.author.username} ha conseguido un Ticket de Padoru de rareza ${rarity},obten toda la informacion en %ticket`)

}

module.exports = {
  giveTicket
}