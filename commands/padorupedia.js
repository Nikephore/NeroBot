const fs = require('fs')
const math = require('./functions/math')
const Discord = require("discord.js")
const argFilter = require('./functions/filter.js')

module.exports = {
  commands: ['padorupedia', 'pp'],
  callback: async (message, arguments, text) =>{
    const padoruString = fs.readFileSync('./padoru.json')
    const seriesString = fs.readFileSync('./series.json')
    const padoru = JSON.parse(padoruString)
    const series = JSON.parse(seriesString)
    var padoruBaseList = []
    var seriesBaseList = []

    for(let i in padoru){
      padoruBaseList.push(padoru[i])
    }

    for(let i in series){
      seriesBaseList.push(series[i])
    }
    
    if(text !== ''){
      padoruBaseList = argFilter.seriesFilter(padoruBaseList, seriesBaseList, text)
      
    } else {
      padoruBaseList = padoruBaseList.filter(a => a.released === true)
    }

    total = padoruBaseList.length

    if(padoruBaseList.length === 0) {
      message.channel.send("No se han encontrado padorus con esas condiciones")
      return
    }
 
    var embed = new Discord.MessageEmbed()
      .setTitle('Padorupedia')
      .setColor('GOLD')
      .setThumbnail('https://cdn.discordapp.com/attachments/901798915425321000/901799120740704276/PADORUorg.png')

    var numPage = 1
    const page = 15
    const totalPages = Math.ceil(total/page)

    var title = ''
    var i = 0
    while(padoruBaseList[i] !== undefined && i < page){
      title = title + '\n`' + (padoruBaseList[i].id) + '`**' + padoruBaseList[i].title + '**' + ' ' + math.rarityConvertAscii(padoruBaseList[i].rarity)
      i++
    }
    
    embed.addField('\u200B', title)
    embed.setFooter(`Página ${numPage}/${totalPages}`)
        
    msg = await message.channel.send(embed)

    if(total <= page){
      return
    }
    msg.react("⬅️")
    msg.react("➡️")

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
          .setThumbnail('https://cdn.discordapp.com/attachments/901798915425321000/901799120740704276/PADORUorg.png')

		  if (reaction.emoji.name === "⬅️") {
        if(numPage === 1){
          numPage = totalPages
        } else {
          numPage--
        }
        console.log(`page <- ${numPage}`)        
		  } else if (reaction.emoji.name === "➡️"){
        if(numPage === totalPages){
          numPage = 1
        } else {
          numPage++
        }
        console.log(`page -> ${numPage}`)  
		  }

      var start = (numPage - 1) * page
      console.log(start)
      var end = numPage * page
      console.log(end)

      let title = ''
      while(padoruBaseList[start] !== undefined && start < end){
        title = title + '\n`' + (padoruBaseList[start].id) + '`**' + padoruBaseList[start].title + '**' + ' ' + math.rarityConvertAscii(padoruBaseList[start].rarity)

        console.log(padoruBaseList[start])
        start ++
      }

      newEmbed.addField('\u200B', title)
      newEmbed.setFooter(`Página ${numPage}/${totalPages}`)

      msg.edit(newEmbed)
      
    })
  }
}