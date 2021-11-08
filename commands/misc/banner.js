module.exports = {
  commands: ['banner'],
  description: 'Muestra el banner en curso actualmente.',
  callback: (message) => {

    message.channel.send('https://cdn.discordapp.com/attachments/903221359268745256/907024958587289640/bannerdrstone.jpg')
  },  
}