const fs = require('fs')
const pad = require('../../databaseFunctions/dbPadoru')

module.exports = {
  commands: ['sa'],
  description: 'setactive',
  callback: async (message, arguments) => {

    if(!arguments[0]){
      message.reply("Formato: %sa <id> <boolean>")
      return
    }
    
    id = parseInt(arguments[0])

    await pad.setactive(id, arguments[1])

    message.reply("Padoru modificado correctamente")
  }
}