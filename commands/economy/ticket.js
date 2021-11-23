const Discord = require("discord.js")
const mongo = require("../../functions/mongo")

module.exports = {
    commands: ['ticket'],
    description: 'Comando para saber la informacion de los Tickets',
    callback: async (message) => {
  
      const tickets = await mongo.myTickets(message.author.id, message.author.username)

      var embed = embed = new Discord.MessageEmbed()
      .setAuthor('Canje de Tickets 🎟️')
      .setColor('RED')
      .setDescription('Usa los Tickets que consigas para intercambiarlos por tus padorus favoritos con el comando **%useticket**')

      embed.addField('Tus Tickets:', `Tickets 3:star: : ${tickets.rareTickets}\nTickets 4:star: : ${tickets.superRareTickets}\nTickets 5:star: : ${tickets.legendTickets}` )

      message.channel.send(embed)
      
    },  
  }