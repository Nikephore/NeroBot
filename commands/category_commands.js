const fs = require('fs')
const path = require('path')
const fil = require('../functions/filter')

function commandsFrom(category){
  let commandList = []

  console.log(category)
  if(category !== ''){
    category = fil.toTitleCase(category)
  }
  
  const readCommands = dir => {
    let files = fs.readdirSync(path.join(__dirname, dir))

    for (let file of files){
      
      let option = require(path.join(__dirname, dir, file))
      commandList.push(option)   
    }
  }

  readCommands(`./${category}`)

  return commandList
}

module.exports = {
  commandsFrom
}