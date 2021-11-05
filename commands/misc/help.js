const loadCommands = require('../command_loader')
const { prefix } = require('../../config.json')
const Discord = require("discord.js")

module.exports = {
  commands: ['help', 'h'],
  description: 'Comando que muestra todos los comandos de este bot',
  callback: (message) => {

    let commands = loadCommands()

    let msg = new Discord.MessageEmbed()

    let reply = ''
    for(const command of commands){
      const mainCommand = 
        typeof command.commands === 'string' 
        ? command.commands 
        : command.commands[0]
      const args = command.expectedArgs ? ` ${command.expectedArgs}` : ''
      const { description } = command

      reply += `**${mainCommand}${args} : ${description}\n`
    }

    msg.setTitle('Guia de comandos de Nero')
    msg.setDescription('Bot de coleccionismo de Padorus. Consigue Padorus de distintas series y colores si tienes la suerte necesaria. Presta atención, pues algunos Padorus solo aparecerán por tiempo limitado durante sus banners, no te quedes sin ellos.')
    msg.setColor('DARK_BLUE')
    msg.addField('\u200B', 'El prefijo del bot es %')
    msg.addField('\u200B', reply)
    msg.setFooter(`Twitter: https://twitter.com/NeroPadoruBot`)


    message.channel.send(msg)
  },
}