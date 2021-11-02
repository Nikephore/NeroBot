const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()

//Definicion de las constantes relacionadas con Discord
const Discord = require("discord.js")
const client = new Discord.Client()
client.commands = new Discord.Collection()

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

const {
  token,
} = require('./config.json')

app.get('/',function (req, res) {
  res.send('pichula')
})
 let port = process.env.PORT || 3000;
 app.listen(port)
  
 require('dotenv').config()

 //////////////////////////////////////////////////

/**
 * El bot está encendido, nice
 */
client.once("ready", () => {
    client.user.setActivity("el gran incendio de Roma", {type: 'WATCHING'})
    console.log("Nero esta on fire")

    const mongo = require('./mongo')
    mongo()
    
    const baseFile = 'command_base.js'
    const commandBase = require(`./commands/${baseFile}`)

    const readCommands = dir => {
      const files = fs.readdirSync(path.join(__dirname, dir))

      for (const file of files){
        const stat = fs.lstatSync(path.join(__dirname, dir, file))

        if(stat.isDirectory()){
          readCommands(path.join(dir, file))
        } else if (file !== baseFile) {
          const option = require(path.join(__dirname, dir, file))
          commandBase(client, option)
        }
      }
    }

    readCommands('commands')
})

client.login(token)