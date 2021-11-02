module.exports = {
  commands: ['help'],
  callback: (message) => {

    message.channel.send('**Comandos:**\n%p: Sacar un padoru y añadirlo a tu colección.\n%pp: Ver la lista entera de Padorus.\n%ip: Mirar un padoru especifico.\n%mpp: Ver mi colección de Padorus.')
  },  
}