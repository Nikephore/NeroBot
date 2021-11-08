const fs = require('fs')
const embed = require('../../functions/embed')
const math = require('../../functions/math')
const argFilter = require('../../functions/filter.js')

module.exports = {
  commands: ['mypadorupediaimage', 'mppi'],
  description: 'Muestra tu lista de Padorus en formato de imágenes',
  maxArgs: 1,
  expectedArgs: '<Nombre>',
  callback: async (message, arguments, text) => {
    const target = message.mentions.users.first() || message.author

    const jsonString = fs.readFileSync('./padoru.json')
    const seriesString = fs.readFileSync('./series.json')

    const series = JSON.parse(seriesString)
    const padoru = JSON.parse(jsonString)

    var padoruBaseList = []
    for(var i in padoru){
      padoruBaseList.push(padoru[i])
    }

    var seriesBaseList = []
    for(var i in series){
      seriesBaseList.push(series[i])
    }

    const total = padoruBaseList.length
    var infoPadoru = null
    var idPadoru = 0

    /* Si el primer argumento es un usuario
    borramos su mencion del texto a filtrar */
    if(text !== ''){
        if(arguments[0].startsWith('<@')){
          text = text.replace(arguments[0], '')
          text = text.replace(' ', '')
        }

        if(text !== ''){
            padoruBaseList = argFilter.seriesFilter(padoruBaseList, seriesBaseList, text)
            if(padoruBaseList.length === 0){
                message.channel.send('No hay ningún padoru que cumpla esas condiciones')
                return
            }
          }
    }
      
    padoruBaseList = padoruBaseList.filter(a => a.released === true)
  
    // Obtenemos la lista de Padorus del user
    const padoruList = await economy.myPadorus(target.id)
      
    padoruList.sort((a,b) => (a > b) ? 1 : ((b > a) ? -1 : 0))
  
    padoruBaseList = padoruBaseList
      .filter(a => padoruList.includes(a.id))
  
    const count = padoruBaseList.length

    infoPadoru = padoruBaseList[idPadoru] // El índice del primer padoru de la lista del usuario
    
    infoPadoru.footer = `${idPadoru}/${count}`

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
				newId = idPadoru - 1
      	if(newId === -1){
        	newId = count - 1
      	}
			} else if (reaction.emoji.name === "➡️"){
      	newId = idPadoru + 1
				if(newId === count){
					newId = 0
				}
			}

    	infoPadoru = padoruBaseList[newId]
			infoPadoru.footer = `${newId}/${count}`
      var newResult = embed.embedCreator(infoPadoru, '')
      msg.edit(newResult)
  	})
} 
}