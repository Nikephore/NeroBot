const mongo = require("../../functions/mongo")

module.exports = {
    commands: ['up'],
    description: 'testeos, no usar',
    callback: async (message) => {

			const padorupedia = await mongo.myPadorus(message.author.id)

      await mongo.updateProfile(message.author.id, padorupedia, message.author.username)
  
      message.channel.send(`Estoy haciendo cosas`)
    },  
  }