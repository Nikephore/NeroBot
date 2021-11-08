const fs = require('fs')
const embed = require('../../functions/embed')
const math = require('../../functions/math')

module.exports = {
  commands: ['infopadoru', 'ip'],
  description: 'Información del padoru, también puedes buscar por ID',
  maxArgs: 1,
  expectedArgs: '<Nombre>',
  callback: async (message, arguments, text) => {
    const jsonString = fs.readFileSync('./padoru.json')
    const padoru = JSON.parse(jsonString)
    var padoruBaseList = []

    for(var i in padoru){
      padoruBaseList.push(padoru[i])
    }

    const total = padoruBaseList.length
    var info = parseInt(arguments[0])
    var name = text
    var infoPadoru = null

    if (!arguments[0]){
      infoPadoru = padoruBaseList[0]
    } else {
      infoPadoru = padoruBaseList.find(e => e.title.toLowerCase() === name.toLowerCase())
      if(infoPadoru === undefined){
        infoPadoru = padoruBaseList.find(e => e.id === info)
        if(infoPadoru === undefined){
          message.channel.send('Ese padoru no existe')
          return
        }
      }
    }
    
    if(!infoPadoru.released){
      message.channel.send('Este padoru aún no ha salido de forma oficial, no se puede ver su información')
      return
    }

    infoPadoru.footer = `${infoPadoru.id}/${total}`

    result = embed.embedCreator(infoPadoru, '')

    const prev = '<a:prev:901832158304415765>'
    const next = '<a:next:901832288378187816>'

    msg = await message.channel.send(result)
    msg.react("⬅️")
    msg.react("➡️")

    const filter = (reaction, user) => {
      return ["⬅️", "➡️"].includes(reaction.emoji.name) && (!user.bot)
    }

    const collector = msg.createReactionCollector(filter, {
        time: 120000,
    })

    collector.on('collect', (reaction) => {
      var newId = null

		  if (reaction.emoji.name === "⬅️") {
        
        newId = (infoPadoru.id - 1) % total
        if(newId === 0){
          newId = total
        }
		  } else if (reaction.emoji.name === "➡️"){
        newId = (infoPadoru.id + 1) % total
		  }

      infoPadoru = padoruBaseList.find(e => e.id === newId)
      if(!infoPadoru.released){
        msg.edit(`El padoru con id **${newId}** aún no ha salido de forma oficial, no se puede ver su información`)
      } else {
        msg.edit('ㅤ')
        infoPadoru.footer = `${newId}/${total}`
        var newResult = embed.embedCreator(infoPadoru, '')
        msg.edit(newResult)
      }
    })
  } 
}