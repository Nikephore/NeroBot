const fs = require('fs')
const path = require('path')

module.exports = (client) => {
    let baseFile = 'command_base.js'
    let notFiles = [
      'command_base.js',
      'category_loader.js',
      'command_loader.js',
      'category_commands.js'
    ]

    let commandBase = require(`./${baseFile}`)

    let commandList = []

    const readCommands = dir => {
      let files = fs.readdirSync(path.join(__dirname, dir))

      for (let file of files){
        let stat = fs.lstatSync(path.join(__dirname, dir, file))

        if(stat.isDirectory()){
          readCommands(path.join(dir, file))
        } else if (!notFiles.includes(file)) {
          let option = require(path.join(__dirname, dir, file))
          commandList.push(option)
          if(client){
            commandBase(client, option)
          }
        }
      }
    }

    readCommands('.')

    console.log(commandList)

    return commandList
}