const Discord = require("discord.js")
const fs = require('fs')
const economy = require('../../economy.js')
//function files
const math = require('../functions/math.js')
const argFilter = require('../functions/filter.js')


module.exports = {
  commands: ['mypadorupedia','mpp'],
  description: 'Muestra la lista de los Padorus que has obtenido',
  maxArgs: 1,
  expectedArgs: '<@User>',
  callback: async (message, arguments, text) =>{
    const target = message.mentions.users.first() || message.author
    const targetId = target.id

    const padoruString = fs.readFileSync('./padoru.json')
    const seriesString = fs.readFileSync('./series.json')

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

    if(text !== ''){
      padoruBaseList = argFilter.seriesFilter(padoruBaseList, seriesBaseList, text)
      
    } else {
      padoruBaseList = padoruBaseList.filter(a => a.released === true)
    }

    const total = padoruBaseList.length

    const padoruList = await economy.myPadorus(target.id)
    

    padoruList.sort((a,b) => (a > b) ? 1 : ((b > a) ? -1 : 0))

    padoruBaseList = padoruBaseList
      .filter(a => padoruList.includes(a.id))

    const count = padoruBaseList.length
    
    msg = new Discord.MessageEmbed()
      .setAuthor('Padorupedia de ' + target.username, message.author.avatarURL)
      .setColor('RED')
      .setThumbnail('https://cdn.discordapp.com/attachments/901798915425321000/901799120740704276/PADORUorg.png')
      .setFooter(`Obtenidos ${count}/${total}`)

    //Situamos los padorus en el embed y enviamos el mensaje
    var title = ''
    //var i = 0
    
    for(i = 0; i < count; i++){
      title = title + '\n`' + (padoruBaseList[i].id) + '`**' + padoruBaseList[i].title + '**' + ' ' + math.rarityConvertAscii(padoruBaseList[i].rarity)
    }

    if(title !== ''){
      msg.addField('\u200B', title)
    } else {
      msg.addField('\u200B', 'cri cri')
    }
    
    message.channel.send(msg)
    
  }
}
