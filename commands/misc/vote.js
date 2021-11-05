module.exports = {
    commands: ['vote'],
    description: 'Comando para votar por Nero en la página top.gg',
    callback: (message) => {
  
      message.channel.send(`Puedes votar por Nero en este enlace cada 12 horas\nhttps://top.gg/bot/442790194555650048/vote`)
    },  
  }