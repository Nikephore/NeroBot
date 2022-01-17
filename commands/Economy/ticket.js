const Discord = require("discord.js")
const mongo = require('../../databaseFunctions/dbNewProfile')

module.exports = {
    commands: ['ticket'],
    description: 'Command to see the info about the tickets',
    callback: async (message) => {
  
      const tickets = await mongo.myTickets(message.author.id, message.author.username)

      var embed = embed = new Discord.MessageEmbed()
      .setAuthor('Ticket exchange 🎟️')
      .setColor('RED')
      .setDescription(`Use tickets to upgrade your padorus or buy the ones you don't have yet. The command to upgrade is **%upgrade** and the one to buy is **%buypadoru**.\n\nYou can see the full padoru list writing **%padorupedia**`)
      .setThumbnail('https://cdn.discordapp.com/attachments/901798915425321000/903364058818953236/padoru_shiro.png')

      embed.addField('Upgrade Padorus:', `Padoru 1 :star: = 5 🎟️\nPadoru 2 :star: = 7 🎟️\nPadoru 3 :star: = 10 🎟️\nPadoru 4 :star: = 15 🎟️\nPadoru 5 :star: = 25 🎟️`)

      embed.addField('Buy Padorus:', `Padoru 1 :star: = 10 🎟️\nPadoru 2 :star: = 25 🎟️\nPadoru 3 :star: = 50 🎟️\nPadoru 4 :star: = 75 🎟️\nPadoru 5 :star: = 150 🎟️`)

      embed.addField('Owner weekly rewards:', `Top 1 = 100 🎟️\nTop 2 = 75 🎟️\nTop 3-5 = 50 🎟️\nTop 6-10 = 40 🎟️\nTop 11-20 = 25 🎟️\n Top 21 and below = 10 🎟️`)

      embed.addField('You can see your position using %topowner', 'The rewards are delivered every Wednesday')

      embed.addField(`You currently have **${tickets}** 🎟️`, '\u200B')

      message.channel.send(embed)
      
    },  
  }