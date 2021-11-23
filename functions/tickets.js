const mongo = require('../functions/mongo')

function giveTicket(message, rarity) {

	await mongo.addTicket(message.author.id, message.author.username, rarity)

	message.react('🎟️')

	const filter = (reaction, user) => {
		return ["🎟️"].includes(reaction.emoji.name) && (!user.bot)
	}

	message.awaitReactions({ filter, max: 1, time: 60000, errors: ['time'] })
	.then(collected => {
		const reaction = collected.first()

		if (reaction.emoji.name === '🎟️') {
			message.reply('Has conseguido un Ticket de Padoru, obten toda la info usando %ticket')
		}
	})
}

module.exports = {
  giveTicket
}