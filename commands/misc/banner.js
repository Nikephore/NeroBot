module.exports = {
  commands: ['banner'],
  description: 'Muestra el banner en curso actualmente.',
  callback: (message) => {

    message.channel.send('https://cdn.discordapp.com/attachments/901798915425321000/912500522915876904/bannerinazuma.jpg')
  },  
}