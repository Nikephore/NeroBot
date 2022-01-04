const fs = require('fs')
const pr = require ('../../databaseFunctions/dbProfile')
const Discord = require("discord.js")
const mongo = require('../../databaseFunctions/dbNewProfile')
const math = require('../../functions/math')

module.exports = {
  commands: ['upgrade', 'up'],
  description: 'Command to upgrade your Padorus. Increases  its rarity',
  callback: async (message, arguments) => {
    if(!arguments[0]){
      message.reply('Write the ID of the Padoru to upgrade. Format: %upgrade <id>')
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
      message.reply(`This Padoru doesn't exist`)
      return
    }

    const rarityValues = {
      1 : 5,
      2 : 7,
      3 : 10,
      4 : 15,
      5 : 25,
      6 : -1
    }

    const tt = rarityValues[infopadoru.rarity.toString()]

    if(tt > tickets){
      message.reply(`You need **${tt - tickets}** 🎟️ more to exchange **${infopadoru.title}**`)
      return
    }

    if(tt === -1){
      message.reply(`You can't upgrade this type of Padoru`)
    }

    mypadorus = await pr.myPadorus(message.author.id, message.author.username)

    finalpadoru = mypadorus.pp.find(e => e.id === infopadoru.id)

    if(finalpadoru === undefined){
      message.reply(`You don't have **${infopadoru.title}**`)
      return
    }

    if(finalpadoru.rarity > 0){
      message.channel.send(`Yoy can't upgrade more times the ${infopadoru.title}`)
      return
    }

    message.channel.send(`You have upgraded **${infopadoru.title}** for **${tt}** tickets`)

    await pr.upgradePadoru(message.author.id, infopadoru.id)

    await mongo.removeTicket(message.author.id, message.author.username, tt)

    return
  }
}