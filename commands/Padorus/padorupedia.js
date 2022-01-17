const fs = require('fs')
const math = require('../../functions/math')
const Discord = require("discord.js")
const argFilter = require('../../functions/filter.js')
const padList = require('../../databaseFunctions/dbPadoru')

module.exports = {
  commands: ['padorupedia', 'pp'],
  description: 'List with all the Padorus. Short ver. %pp',
  callback: async (message, arguments, text) =>{
    const seriesString = fs.readFileSync('./json/series.json')
    const series = JSON.parse(seriesString)
    const leyenda = ":no_entry_sign: = You can't roll this Padoru right now\n:bangbang: = Padoru rate up!!"
    var seriesBaseList = []

    var numPage = 1
    
    padorus = await padList.getAll()

    for(let i in series){
      seriesBaseList.push(series[i])
    }
    
    if(text !== ''){
      if(isNaN(parseInt(arguments[0]))){
          plist = argFilter.padoruInSeriesFilter(plist, seriesBaseList, text)
          seriesBaseList = argFilter.seriesFilter(seriesBaseList, text)
        } else {
          numPage = parseInt(arguments[0])
        }
      
    } else {
      padorus = padorus.filter(a => a.released === true)
    }

    total = padorus.length

    if(padorus.length === 0) {
      message.channel.send("No se han encontrado padorus con esas condiciones")
      return
    }
 
    var embed = new Discord.MessageEmbed()
      .setTitle('Padorupedia')
      .setColor('GOLD')

    const page = 15
    const totalPages = Math.ceil(total/page)

    if(numPage > totalPages){
      numPage = totalPages
    }

    var title = ''
    var i = page * (numPage - 1)
    while(padorus[i] !== undefined && i < page * numPage){
      var act = padorus[i].active ? '' : ':no_entry_sign:'
      var banner = padorus[i].banner ? ':bangbang:' : ''
      title = title + '\n`' + (padorus[i].id) + '`**' + padorus[i].title + '**' + ' ' + math.rarityConvertAscii(padorus[i].rarity) + ' ' + act + banner
      i++
    }
    
    embed.addField('\u200B', title)
    embed.addField('Symbols', leyenda)
    embed.setFooter(`Página ${numPage}/${totalPages}`)
        
    msg = await message.channel.send(embed)

    if(total <= page){
      return
    }
    msg.react("⬅️")
    msg.react("➡️")

    await editMessage(msg, numPage, totalPages, page, padorus, leyenda)
  }
}

async function editMessage(msg, numPage, totalPages, page, padorus, leyenda){
  const filter = (reaction, user) => {
    return ["⬅️", "➡️"].includes(reaction.emoji.name) && (!user.bot)
  }

  const collector = msg.createReactionCollector(filter, {
    time: 120000,
  })

  collector.on('collect', (reaction) => {

  var newEmbed = new Discord.MessageEmbed()
    .setTitle('Padorupedia')
    .setColor('GOLD')

	if (reaction.emoji.name === "⬅️") {
    if(numPage === 1){
      numPage = totalPages
    } else {
      numPage--
    }      
	} else if (reaction.emoji.name === "➡️"){
    if(numPage === totalPages){
      numPage = 1
    } else {
      numPage++
    } 
	}

  var start = (numPage - 1) * page
  var end = numPage * page

  let title = ''
      
  while(padorus[start] !== undefined && start < end){
    var act = padorus[start].active === false ? ':no_entry_sign:' : ''
    var banner = padorus[start].banner === true ? ':bangbang:' : ''
    title = title + '\n`' + (padorus[start].id) + '`**' + padorus[start].title + '**' + ' ' + math.rarityConvertAscii(padorus[start].rarity, 0) + ' ' + act + banner
        
    start ++
  }

  newEmbed.addField('\u200B', title)
  newEmbed.addField('Symbols', leyenda)
  newEmbed.setFooter(`Página ${numPage}/${totalPages}`)

  msg.edit(newEmbed)

  })
}