const Discord = require("discord.js")
const fs = require('fs')
const economy = require('../../economy.js')
//function files
const math = require('../../functions/math.js')
const argFilter = require('../../functions/filter.js')


module.exports = {
  commands: ['mypadorupedia','mpp'],
  description: 'Muestra la lista de los Padorus que ha obtenido un usuario',
  maxArgs: 1,
  expectedArgs: '<@User>',
  callback: async (message, arguments, text) =>{
    const target = message.mentions.users.first() || message.author
    const targetId = target.id

    const padoruString = fs.readFileSync('./json/padoru.json')
    const seriesString = fs.readFileSync('./json/series.json')

    const padoru = JSON.parse(padoruString)
    const series = JSON.parse(seriesString)

    var padoruBaseList = []
    for(var i in padoru){
      padoruBaseList.push(padoru[i])
    }

    var seriesBaseList = []
    for(var i in series){
      seriesBaseList.push(series[i])
    }

    /* Si el primer argumento es un usuario
    borramos su mencion del texto a filtrar */
    if(text !== ''){
      if(arguments[0].startsWith('<@')){
        text = text.replace(arguments[0], '')
        text = text.replace(' ', '')
      }
      // Filtramos los Padorus por serie
      if(text !== ''){
        padoruBaseList = argFilter.seriesFilter(padoruBaseList, seriesBaseList, text)
      }
    }
    
    padoruBaseList = padoruBaseList.filter(a => a.released === true)

    const total = padoruBaseList.length

    // Obtenemos la lista de Padorus del user
    const padoruList = await economy.myPadorus(target.id)
    

    padoruList.sort((a,b) => (a > b) ? 1 : ((b > a) ? -1 : 0))

    padoruBaseList = padoruBaseList
      .filter(a => padoruList.includes(a.id))

    const count = padoruBaseList.length
    
    var numPage = 1
    const page = 15
    const totalPages = Math.ceil(count/page)

    // Creamos el mensaje para Discord
    embed = new Discord.MessageEmbed()
      .setAuthor('Padorupedia de ' + target.username, message.author.avatarURL)
      .setColor('RED')
      .setThumbnail('https://cdn.discordapp.com/attachments/901798915425321000/901799120740704276/PADORUorg.png')
      .setFooter(`Página ${numPage}/${totalPages}  |  Obtenidos ${count}/${total}`)

    //Situamos los padorus en el embed y enviamos el mensaje
    var title = ''
    
    var i = 0
    while(padoruBaseList[i] !== undefined && i < page) {
      title = title + '\n`' + (padoruBaseList[i].id) + '`**' + padoruBaseList[i].title + '**' + ' ' + math.rarityConvertAscii(padoruBaseList[i].rarity)

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
          .setThumbnail('https://cdn.discordapp.com/attachments/901798915425321000/901799120740704276/PADORUorg.png')

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
      
      while(padoruBaseList[start] !== undefined && start < end){
        title = title + '\n`' + (padoruBaseList[start].id) + '`**' + padoruBaseList[start].title + '**' + ' ' + math.rarityConvertAscii(padoruBaseList[start].rarity)
        
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
