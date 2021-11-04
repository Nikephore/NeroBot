const { prefix } = require('../config.json')
const Duration = require('humanize-duration')

/*const validatePermissions = (permission) => {

}*/

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

  if (typeof commands === 'string') {
    commands = [commands]
  }

  client.on('message', message => {
    const { member, content, guild } = message

    //Comprobamos si nos han pasado un comando
    for (const alias of commands) {
      
      const arguments = content.split(/[ ]+/)
      command = `${prefix}${alias.toLowerCase()}`
      if(command === arguments[0].toLowerCase()) {
        //Comprobamos si el usuario tiene permiso
        /*
        for (const permission of permissions) {
          if(!member.hasPermission(permission)) {
            message.reply(permissionError)
            return
          }
        }

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
        
        let data = `
        ----------
        User: ${message.author.username}-${member.id}
        Guild: ${guild.name}-${guild.id}
        Command: ${command}
        Date: ${Date.now().toLocaleString()}
        ----------`

        fs.writeFile('logger.txt', data, (err) => {
          if(err) throw err
        })

       
        callback(message, arguments, arguments.join(' '))

        return
      }
    }
  })
}