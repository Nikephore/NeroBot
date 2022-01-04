const Discord = require("discord.js")
const fs = require('fs')
const profile = require('../../databaseFunctions/dbProfile')
//function files
const math = require('../../functions/math')
const argFilter = require('../../functions/filter')
const padList = require('../../databaseFunctions/dbPadoru')


module.exports = {
  commands: ['mypadorupedia','mpp'],
  description: 'Shows your Padoru List on text format. Short ver. %mpp',
  maxArgs: 1,
  expectedArgs: '<@User>',
  callback: async (message, arguments, text) =>{
    const target = message.mentions.users.first() || message.author
    const targetId = target.id

    const seriesString = fs.readFileSync('./json/series.json')

    const series = JSON.parse(seriesString)

    var seriesBaseList = []
    for(var i in series){
      seriesBaseList.push(series[i])
    }

    var plist = await padList.getAll()
    plist = plist.filter(a => a.released === true)

    /* Si el primer argumento es un usuario
    borramos su mencion del texto a filtrar */
    if(text !== ''){
      if(arguments[0].startsWith('<@')){
        text = text.replace(arguments[0], '')
        text = text.replace(' ', '')
      }
      // Filtramos los Padorus por serie
      if(text !== ''){
        plist = argFilter.padoruInSeriesFilter(plist, seriesBaseList, text)
        seriesBaseList = argFilter.seriesFilter(seriesBaseList, text)
      }
    }

    const total = plist.length

    if (total === 0) return

    // Obtenemos la lista de Padorus del user
    const padoruList = await profile.myPadorus(target.id)
    
    plist.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))
    
    padoruList.pp.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))
    
    plist = plist.filter(a => padoruList.pp.some(e => e.id === a.id))

    const count = plist.length
    
    var numPage = 1
    const page = 15
    const totalPages = Math.ceil(count/page)

    const pr = await profile.getProfile(target.id)

    // Creamos el mensaje para Discord
    embed = new Discord.MessageEmbed()
      .setAuthor(target.username + "'s Padorupedia", message.author.avatarURL)
      .setColor('RED')
      .setThumbnail(pr.favpadoru)
      .setFooter(`Página ${numPage}/${totalPages}  |  Obtenidos ${count}/${total}`)

    //Situamos los padorus en el embed y enviamos el mensaje
    var title = ''
    
    var i = 0
    while(plist[i] !== undefined && i < page) {
      title = title + '\n`' + (plist[i].id) + '`**' + plist[i].title + '**' + ' ' + math.rarityConvertAscii(plist[i].rarity)

      i++
    }

    if(count === total && count > 0){
      embed.setTitle(':sparkles::sparkles::sparkles::sparkles::sparkles:')
    }

    if(title !== ''){
      embed.addField('\u200B', title)
    } else {
      embed.addField('\u200B', 'cri cri')
    }
    
    msgmpp = await message.channel.send(embed)
    
    if(count <= page){
      return
    }
    msgmpp.react("⬅️")
    msgmpp.react("➡️")

    const filter = (reaction, user) => {
      return ["⬅️", "➡️"].includes(reaction.emoji.name) && (!user.bot)
    }

    const collector = msgmpp.createReactionCollector(filter, {
        time: 120000,
    })

    collector.on('collect', (reaction) => {

      var newEmbed = new Discord.MessageEmbed()
          .setTitle('Padorupedia de ' + target.username, message.author.avatarURL)
          .setColor('RED')
          .setThumbnail(pr.favpadoru)

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
      
      while(plist[start] !== undefined && start < end){
        title = title + '\n`' + (plist[start].id) + '`**' + plist[start].title + '**' + ' ' + math.rarityConvertAscii(plist[start].rarity)
        
        start ++
      }

      if(count === total && count > 0){
      newEmbed.setTitle(':sparkles::sparkles::sparkles::sparkles::sparkles:')
    }

      newEmbed.addField('\u200B', title)
      newEmbed.setFooter(`Página ${numPage}/${totalPages}  |  Obtenidos ${count}/${total}`)

      msgmpp.edit(newEmbed)
      
    })
  }
}
