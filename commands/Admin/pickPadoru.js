const fs = require('fs')
const math = require('../../functions/math')
const pad = require('../../databaseFunctions/dbPadoru')

module.exports = {
  commands: ['pick'],
  description: 'ap',
  callback: async (message, arguments) => {

    if(message.author.id !== 306496475251081217 || message.author.id !== 298827070224728066){
      return
    }

    const padoru = await pad.pickOne(parseInt(arguments[0]))

    console.log(padoru)

    message.reply(padoru.title)
    }
}