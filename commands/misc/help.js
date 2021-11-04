module.exports = {
  commands: ['help'],
  callback: (message) => {

    message.channel.send(
      `**Comandos:**
      %p: Sacar un padoru y añadirlo a tu colección.
      %pp: Ver la lista entera de Padorus.
      %ip: Mirar un padoru especifico.
      %mpp: Ver mi colección de Padorus.`)
  },
}