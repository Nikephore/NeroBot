module.exports = {
  commands: ['gn'],
  description: 'Nero te manda un mensaje de buenas noches',
  callback: (message) => {

    message.channel.send(`yo tambien se dar las buenas noches así que jodete Timmy. Se acabó tu tiranía de los gn. Buenas noches <@${message.author.id}>, descansa.`)
  },  
}