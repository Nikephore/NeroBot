const fs = require('fs')
const pr = require ('../../databaseFunctions/dbProfile')
const Discord = require("discord.js")
const mongo = require('../../databaseFunctions/dbNewProfile')
const math = require('../../functions/math')

module.exports = {
  commands: ['buypadoru', 'bp'],
  description: 'Command to exchange your tickets for Padorus',
  callback: async (message, arguments) => {
    if(!arguments[0]){
      message.reply('Write the ID of the Padoru to exchange. Format: %buypadoru <id>')
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

    const rarityValues = {
      1 : 5,
      2 : 20,
      3 : 35,
      4 : 60,
      5 : 100,
      6 : -1
    }

    const tt = rarityValues[infopadoru.rarity.toString()]

    if(tt === -1){
      message.reply(`You can't exchange this type of Padoru`)
    }

    mypadorus = await pr.myPadorus(message.author.id, message.author.username)

    finalpadoru = mypadorus.find(e => e === infopadoru.id)

    if(finalpadoru !== undefined){
      message.reply(`You already have **${infopadoru.title}**`)
      return
    }

    if(!finalpadoru.active){
      message.reply(`**${infopadoru.title}** isn't active right now`)
      return
    }

    if(tt > tickets){
      message.reply(`You need **${tt - tickets}** 🎟️ more to buy **${infopadoru.title}**`)
      return
    }

    message.channel.send(`You have excahnge **${tt} tickets for **${infopadoru.title}**`)

    await pr.newPadoru(message.author.id, infopadoru.id)

    await mongo.removeTicket(message.author.id, message.author.username, tt)

    return
  }
}