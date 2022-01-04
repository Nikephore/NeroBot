const fs = require('fs')
const embed = require('../../functions/embed')
const math = require('../../functions/math')
const mongo = require('../../databaseFunctions/dbProfile')
const argFilter = require('../../functions/filter.js')
const padList = require('../../databaseFunctions/dbPadoru')

module.exports = {
  commands: ['mypadorupediaimage', 'mppi'],
  description: 'Shows your Padoru List on embed format. Short ver. %mppi',
  maxArgs: 1,
  expectedArgs: '<Nombre>',
  callback: async (message, arguments, text) => {
    const target = message.mentions.users.first() || message.author

    const seriesString = fs.readFileSync('./json/series.json')

    const series = JSON.parse(seriesString)

    var seriesBaseList = []
    for(var i in series){
      seriesBaseList.push(series[i])
    }

    var infoPadoru = null
    var idPadoru = 0

    var plist = await padList.getAll()
    plist = plist.filter(a => a.released === true)

    /* Si el primer argumento es un usuario
    borramos su mencion del texto a filtrar */
    if(text !== ''){
        if(arguments[0].startsWith('<@')){
          text = text.replace(arguments[0], '')
          text = text.replace(' ', '')
        }

        if(text !== ''){
            plist = argFilter.padoruInSeriesFilter(plist, seriesBaseList, text)
            if(plist.length === 0){
                message.channel.send('No hay ningún padoru que cumpla esas condiciones')
                return
            }
          }
    }
  
    // Obtenemos la lista de Padorus del user
    const padoruList = await mongo.myPadorus(target.id)

    plist.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))

    padoruList.pp.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))
  
    plist = plist.filter(a => padoruList.pp.some(e => e.id === a.id))
  
    const count = plist.length

    infoPadoru = plist[idPadoru] // El índice del primer padoru de la lista del usuario

    const found = padoruList.pp.find(e => e.id === infoPadoru.id)
    
    infoPadoru.footer = `${idPadoru+1}/${count}`

    const rs = math.rarityConvertEmoji(infoPadoru.rarity, found.rarity)

    result = embed.embedCreator(infoPadoru, '', null, -1, null, rs)

    const prev = '<a:prev:901832158304415765>'
    const next = '<a:next:901832288378187816>'

    msg = await message.channel.send(result)
    msg.react("⬅️")
    msg.react("➡️")

    const filter = (reaction, user) => {
      return ["⬅️", "➡️"].includes(reaction.emoji.name) && (!user.bot)
    }

    editMessage(msg, idPadoru, filter, infoPadoru, count, plist, padoruList)
  } 
}

function editMessage(msg, idPadoru, filter, infoPadoru, count, plist, padoruList){
  const collector = msg.createReactionCollector(filter, {
    time: 120000,
  })

  var newId = idPadoru
  collector.on('collect', (reaction) => {
      
		if (reaction.emoji.name === "⬅️") {
			newId = newId - 1
      if(newId === -1){
      	newId = count - 1
      }
		} else if (reaction.emoji.name === "➡️"){
      newId = newId + 1
			if(newId === count){
				newId = 0
			}
		}

    infoPadoru = plist[newId]

    const found = padoruList.pp.find(e => e.id === infoPadoru.id)
    const rs = math.rarityConvertEmoji(infoPadoru.rarity, found.rarity)

		infoPadoru.footer = `${newId+1}/${count}`
    var newResult = embed.embedCreator(infoPadoru, '', null, -1, null, rs)
    msg.edit(newResult)
  })
}