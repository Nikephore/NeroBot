const loadCommands = require('../command_loader')
const loadCategories = require('../category_loader')
const cc = require('../category_commands')
const { prefix } = require('../../config.json')
const Discord = require("discord.js")

module.exports = {
  commands: ['help', 'h'],
  description: 'Comando que muestra todos los comandos de este bot',
  callback: (message, arguments) => {

    
    var commands = loadCommands()
    var mainCommands = []
    for(command of commands){
      const mainCommand = 
      typeof command.commands === 'string' 
        ? command.commands 
        : command.commands[0]
      
      mainCommands.push(mainCommand)
    }

    let cat = loadCategories()

    // Pasa las categorias a minusculas
    var tmp = cat.join('~').toLowerCase()
    var categories = tmp.split('~')

    let msg = new Discord.MessageEmbed()

    msg.setTitle('Nero Help')
    msg.setDescription("**My prefix is %**\n\nI'm a Gacha-like Padoru bot. Obtain coloured Padorus and Padorus from different anime series. This bot also have some event only Padorus. Don't miss your chance to obtain them!\n\nStart playing use %padoru\n\n**To see more info use:**\n%help <category> or\n%help <command>")
    msg.setColor('GREEN')

    if(!arguments[0]){
      let reply = ''

      for(category of cat){
        reply += `${category}\n`
      }
      msg.addField('__Categories__', reply)
    }
    else if(categories.includes(arguments[0].toLowerCase())){

      let reply = ''
      let commands = cc.commandsFrom(arguments[0])

      for(command of commands){
        const mainCommand = 
        typeof command.commands === 'string' 
          ? command.commands 
          : command.commands[0]
        const args = command.expectedArgs ? ` ${command.expectedArgs}` : ''
        const { description } = command

        reply += `**${prefix}${mainCommand}${args}**: ${description}\n`
      }

      msg.addField('__Commands__', reply)
    }

    msg.addField('Useful links', '[Invitation](https://discord.com/api/oauth2/authorize?client_id=442790194555650048&permissions=0&scope=bot) | [Vote](https://top.gg/bot/442790194555650048/vote)')


    message.channel.send(msg)
    
    return
  },
}

