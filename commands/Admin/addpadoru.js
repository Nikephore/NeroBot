const fs = require('fs')
const math = require('../../functions/math')
const pad = require('../../databaseFunctions/dbPadoru')

module.exports = {
  commands: ['ap'],
  description: 'ap',
  callback: async (message) => {
    const jsonString = fs.readFileSync('./json/padoru.json')
    const padoru = JSON.parse(jsonString)
    var padoruBaseList = []

    if(message.author.id !== 306496475251081217 || message.author.id !== 298827070224728066){
      return
    }

    for(var i in padoru){
      padoruBaseList.push(padoru[i])
    }

    padoruBaseList.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))

    padoruBaseList.forEach(e => pad.add(e))

    message.reply("Añadiendo Padorus")
    }
}