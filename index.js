const Topgg = require("@top-gg/sdk")
const express = require("express")
const app = express()
const fs = require('fs')

//Definicion de las constantes relacionadas con Discord
const Discord = require("discord.js")
const client = new Discord.Client()
client.commands = new Discord.Collection()

const loadCommands = require('./commands/command_loader')
const fil = require('./functions/filter')

const {
  token,
  topggtoken,
  auth
} = require('./config.json')

const webhook = new Topgg.Webhook(auth)

const rolls = require('./functions/rolls')

app.post("/dblwebhook", webhook.listener(vote => {
  rolls.addRoll(vote.user, vote.isWeekend)

  console.log(`${vote.user} ha votado!`)

}))

app.get('/dblwebhook',function (req, res) {
  res.send('webhook')
})

const { AutoPoster } = require('topgg-autoposter')

AutoPoster(topggtoken, client)
  .on('posted', () => {
    console.log('Posted stats to Top.gg!')
  })


app.get('/',function (req, res) {
  res.send('pichula')
})
let port = process.env.PORT || 3000;

app.listen(port)
  
require('dotenv').config()

/////////////////////////////////////////////////

/**
 * El bot está encendido, nice
 */
client.once("ready", () => {
    client.user.setActivity("el gran incendio de Roma", {type: 'WATCHING'})
    console.log("Nero esta on fire")

    const mongo = require('./mongo')
    mongo()

    loadCommands(client)
})

client.on('guildCreate', guild => {
  guild.systemChannel.send('¡Hola! soy Nero, el bot de coleccionismo de Padorus. Escribe el comando ``%padoru`` para comenzar a jugar o ``%help`` para ver todos mis comandos.')

  let data = `----------
Guild: ${guild.name}-${guild.id}
----------`

  fs.appendFile('guilds.txt', data, (err) => {
    if(err) throw err
  })
  
})

client.login(token)