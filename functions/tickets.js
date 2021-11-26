const mongo = require('../databaseFunctions/dbNewProfile')

function giveTicket(message, rarity) {

	message.react('🎟️')

  mongo.addTicket(message.author.id, message.author.username)

	message.channel.send(`${message.author.username} ha conseguido un Ticket de Padoru, para mas informacion sobre como canjearlo escribe %ticket\n\nTambien puedes conseguir Padorus escribiendo el comando %padoru`)

}

module.exports = {
  giveTicket
}