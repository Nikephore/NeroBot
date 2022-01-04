const fs = require('fs')
const math = require('../../functions/math')
const pad = require('../../databaseFunctions/dbPadoru')

module.exports = {
  commands: ['addone'],
  description: 'ao',
  callback: async (message, arguments) => {
    const jsonString = fs.readFileSync('./json/padoru.json')
    const padoru = JSON.parse(jsonString)
    var padoruBaseList = []

    console.log(message.author.id)

    if(!arguments[0]){
      message.reply("especifica el id del padoru")
      return
    }
    
    id = parseInt(arguments[0])

    for(var i in padoru){
      padoruBaseList.push(padoru[i])
    }

    await pad.add(padoruBaseList[id-1])

    message.reply("Padoru añadido correctamente")
    }
}