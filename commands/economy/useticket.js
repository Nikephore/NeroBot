const fs = require('fs')
const Discord = require("discord.js")
const mongo = require('../../functions/mongo')
const math = require('../../functions/math')

module.exports = {
  commands: ['useTicket', 'ut'],
  description: 'Comando para canjear tus Tickets',
  callback: async (message, arguments) => {
    if(!arguments[0]){
      message.reply('Pon el ID del Padoru a canjear. Formato: %useTicket <id>')
      return
    }

    const jsonString = fs.readFileSync('./json/padoru.json')
    const padoru = JSON.parse(jsonString)
    var padoruBaseList = []

    for(var i in padoru){
      padoruBaseList.push(padoru[i])
    }

    const tickets = await mongo.myTickets(message.author.id, message.author.username)

    infopadoru = padoruBaseList.find(e => e.id === parseInt(arguments[0]))

    if(infopadoru === undefined){
      message.reply('No se reconoce el padoru elegido')
      return
    }

    if(infopadoru.rarity < 3){
      message.reply('No se pueden canjear Padorus de menos de 3:star:')
      return
    }

    if(!infopadoru.active){
      message.reply(`${infopadoru.title}no esta activo actualmente`)
      return
    }

    if((infopadoru.rarity === 3 && tickets.rareTickets === 0) ||
    (infopadoru.rarity === 4 && tickets.superRareTickets === 0) ||
    (infopadoru.rarity === 5 && tickets.legendTickets === 0)){
      message.reply('No dispones de Tickets suficientes para hacer ese canje')
      return
    }

    var mypadorus = await mongo.myPadorus(message.author.id)

    finalpadoru = mypadorus.find(e => e === infopadoru.id)

    if(finalpadoru !== undefined){
      message.reply(`Ya tienes al **${infopadoru.title}**`)
      return
    }

    message.channel.send(`Has canjeado un Ticket para obtener al **${infopadoru.title}**`)

    await mongo.newPadoru(message.author.id, infopadoru.id)

    await mongo.removeTicket(message.author.id, message.author.username,infopadoru.rarity)

    return
  }
}