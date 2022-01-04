const fs = require('fs')
const profile = require('../../databaseFunctions/dbProfile')
const padList = require('../../databaseFunctions/dbPadoru')

module.exports = {
  commands: ['favpadoru', 'fp'],
  description: 'Set your favourite Padoru. Short ver %fp',
  callback: async (message, arguments) => {

    if(!arguments) {
      message.channel.send('Write the ID of the Padoru to set. Format: %favpadoru <id>')
    }

    const pid = parseInt(arguments[0])

    const padorus = await padList.getAll()

    const padoru = padorus.find(e => e.id === pid)

    if(padoru === undefined){
      message.channel.send(`The Padoru does not exist`)
    }

    await profile.setFavPadoru(message.author.id, padoru.image)

    message.channel.send(`Now your favourite Padoru is **${padoru.title}**`)
  }
}