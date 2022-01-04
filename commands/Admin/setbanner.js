const fs = require('fs')
const pad = require('../../databaseFunctions/dbPadoru')

module.exports = {
  commands: ['sb'],
  description: 'setbanner',
  callback: async (message, arguments) => {

    if(!arguments[0]){
      message.reply("Formato: %sb <id> <boolean>")
      return
    }
    
    id = parseInt(arguments[0])

    await pad.setbanner(id, arguments[1])

    message.reply("Padoru modificado correctamente")
  }
}