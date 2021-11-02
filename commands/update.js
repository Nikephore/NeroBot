const fs = require('fs')
const math = require('./functions/math')
const embed = require('./functions/embed')
const economy = require('../economy')

module.exports = {
  commands: ['up'],
  callback: async (message, arguments, text) => {
    const jsonString = fs.readFileSync('./padoru.json')
    const padoru = JSON.parse(jsonString)
    var padoruBaseList = []

    for(var i in padoru){
      padoruBaseList.push(padoru[i])
    }

    const padoruList = await economy.update(padoruBaseList)

    message.channel.send("Estoy haciendo cosas")
  }

  
  
}