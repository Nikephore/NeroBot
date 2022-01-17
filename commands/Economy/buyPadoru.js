const fs = require('fs')
const pr = require ('../../databaseFunctions/dbProfile')
const Discord = require("discord.js")
const mongo = require('../../databaseFunctions/dbNewProfile')
const math = require('../../functions/math')
const padList = require('../../databaseFunctions/dbPadoru')

module.exports = {
  commands: ['buypadoru', 'bp'],
  description: 'Command to exchange your tickets for Padorus',
  callback: async (message, arguments) => {
    if(!arguments[0]){
      message.reply('Write the ID of the Padoru to exchange. Format: %buypadoru <id>')
      return
    }

    const id = parseInt(arguments[0])

    const padorus = await padList.getAll()

    infopadoru = await padList.pick(id)

    if(infopadoru === undefined){
      message.reply('Unknown Padoru')
      return
    }

    const rarityValues = {
      1 : 10,
      2 : 25,
      3 : 50,
      4 : 75,
      5 : 150,
      6 : -1
    }

    const tt = rarityValues[infopadoru.rarity.toString()]

    if(tt === -1){
      message.reply(`You can't exchange this type of Padoru`)
    }

    mypadorus = await pr.myPadorus(message.author.id, message.author.username)

    finalpadoru = mypadorus.pp.find(e => e.id === infopadoru.id)

    if(finalpadoru !== undefined){
      message.reply(`You already have **${infopadoru.title}**`)
      return
    }

    if(!infopadoru.active){
      message.reply(`**${infopadoru.title}** isn't active right now`)
      return
    }

    const tickets = await mongo.myTickets(message.author.id, message.author.username)

    if(tt > tickets){
      message.reply(`You need **${tt - tickets}** 🎟️ more to buy **${infopadoru.title}**`)
      return
    }

    message.channel.send(`You have excahnge **${tt}** tickets for **${infopadoru.title}**`)

    await pr.newPadoru(message.author.id, infopadoru.id)

    await mongo.removeTicket(message.author.id, message.author.username, tt)

    return
  }
}