const express = require('express')
const app = express()

//Definicion de las constantes relacionadas con Discord
const Discord = require("discord.js")
const client = new Discord.Client()
client.commands = new Discord.Collection()

const loadCommands = require('./commands/command_loader')

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

    loadCommands(client)
})

client.on('guildCreate', guild => {
  guild.systemChannel.send('¡Hola! soy Nero, el bot de coleccionismo de Padorus. Escribe el comando ``%padoru`` para comenzar a jugar o ``%help`` para ver todos mis comandos.')
});

client.login(token)