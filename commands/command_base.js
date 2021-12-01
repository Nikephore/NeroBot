const fs = require('fs')
const math = require('../functions/math')
const ticket = require('../functions/tickets')
const { prefix } = require('../config.json')
const Duration = require('humanize-duration')

const validatePermissions = (permission) => {
  const validPermissions = [
    'CREATE_INSTANT_INVITE', 'KICK_MEMBERS',
    'BAN_MEMBERS',           'ADMINISTRATOR',
    'MANAGE_CHANNELS',       'MANAGE_GUILD',
    'ADD_REACTIONS',         'VIEW_AUDIT_LOG',
    'PRIORITY_SPEAKER',      'STREAM',
    'VIEW_CHANNEL',          'SEND_MESSAGES',
    'SEND_TTS_MESSAGES',     'MANAGE_MESSAGES',
    'EMBED_LINKS',           'ATTACH_FILES',
    'READ_MESSAGE_HISTORY',  'MENTION_EVERYONE',
    'USE_EXTERNAL_EMOJIS',   'VIEW_GUILD_INSIGHTS',
    'CONNECT',               'SPEAK',
    'MUTE_MEMBERS',          'DEAFEN_MEMBERS',
    'MOVE_MEMBERS',          'USE_VAD',
    'CHANGE_NICKNAME',       'MANAGE_NICKNAMES',
    'MANAGE_ROLES',          'MANAGE_WEBHOOKS',
    'MANAGE_EMOJIS'
  ]

  for(const permission of permissions){
    if(!validPermissions.includes(permission)) {
      throw new Error(`Unknown permission node "${permission}`)
    }
  }
}

let recentlyRan = [] //guildId-userId-command
let commandAvailable = {}
const minute = 60000
module.exports = (client, commandOptions) => {
  let {
    commands = [],
    expectedArgs = '',
    permissionError = 'No tienes permiso para ejecutar este comando.',
    minArgs = 0,
    maxArgs = null,
    cooldown = -1,
    requiredRoles = [],
    permissions = [],
    callback
  } = commandOptions

  if(typeof commands === 'string') {
    commands = [commands]
  }

  if(permissions.length){
    if(typeof permissions === 'string') {
      permissions = [permissions]
    }

    validatePermissions(permissions)
  }

  client.on('message', message => {
    const { member, content, guild } = message

    if(math.randomNumberBetween(1, 2000) === 1){
      if(!message.author.bot){
        ticket.giveTicket(message)
      }
    }

    //Comprobamos si nos han pasado un comando
    for (const alias of commands) {
      
      const arguments = content.split(/[ ]+/)
      command = `${prefix}${alias.toLowerCase()}`
      if(command === arguments[0].toLowerCase()) {

        //Comprobamos si el usuario tiene permiso
        for (const permission of permissions) {
          if(!member.hasPermission(permission)) {
            message.reply(permissionError)
            return
          } 
        }
        /*
        //Comprobamos si el usuario tiene los roles correctos
        for (const requiredRole of requiredRoles) {
          const role = guild.roles.cache.find(role => role.name === requiredRole)

          if(!role || !member.roles.cache.has(role.id)) {
            message.reply(`Necesitas tener el rol "${requiredRole}" para usar este comando`)
            return
          }
        }
        */

        //Comprobamos cooldown del usuario
        const now = Date.now()
        
        let cooldownString = `${member.id}-${command}`
        
        if(cooldown > 0 && recentlyRan.includes(cooldownString)){
          let remaining = Duration(commandAvailable[member.id] - now,{units: ['h', 'm'], maxDecimalPoints: 0, language: 'es'})

          message.channel.send(`Necesitas **${remaining} ** antes de poder volver a usar ese comando`)
          
          return   
        }

        arguments.shift()
        
        if(arguments.lenght < minArgs || (maxArgs !== null && arguments.lenght > maxArgs)) {
          message.reply(`La sintaxis correcta es ${prefix}${alias} ${expectedArgs}`)
          return
        }

        if(cooldown > 0){
          commandAvailable[member.id] = now + (cooldown * 1000)
          recentlyRan.push(cooldownString)
          setTimeout(() => {
            recentlyRan = recentlyRan.filter((string) => {
              return string !== cooldownString
            })
          }, 1000 * cooldown)
          if(commandAvailable[member.id]){
            if(commandAvailable[member.id] > Date.now){
              delete commandAvailable[member.id]
            }
          }

        }
        
        const today = new Date(now);
        let data = `
----------
User: ${message.author.username}-${member.id}
Guild: ${guild.name}-${guild.id}
Command: ${command}
Date: ${today.toUTCString()}
----------`

        fs.appendFile('logger.txt', data, (err) => {
          if(err) throw err
        })

        callback(message, arguments, arguments.join(' '))

        return
      }
    }
  })
}