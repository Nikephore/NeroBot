const Discord = require("discord.js")
const mongo = require('../../databaseFunctions/dbNewProfile')

module.exports = {
    commands: ['ticket'],
    description: 'Comando para saber la informacion de los Tickets',
    callback: async (message) => {
  
      const tickets = await mongo.myTickets(message.author.id, message.author.username)

      var embed = embed = new Discord.MessageEmbed()
      .setAuthor('Canje de Tickets 🎟️')
      .setColor('RED')
      .setDescription('Usa los Tickets que consigas para intercambiarlos por tus padorus favoritos con el comando **%useticket**.\nPuedes ver la lista completa de Padorus usando el comando **%padorupedia**')
      .setThumbnail('https://cdn.discordapp.com/attachments/901798915425321000/903364058818953236/padoru_shiro.png')

      embed.addField('Precio de los Padorus:', `Padoru 1:star: = 3 🎟️\nPadoru 2:star: = 15 🎟️\nPadoru 3:star: = 30 🎟️\nPadoru 4:star: = 60 🎟️\nPadoru 5:star: = 100 🎟️`)

      embed.addField(`Actualmente tienes **${tickets}** 🎟️`, '\u200B')

      message.channel.send(embed)
      
    },  
  }