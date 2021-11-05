module.exports = {
  commands: ['lyrics'],
  description: 'Letra de la canción Padoru Padoru',
  callback: (message) => {

    message.channel.send(
      `
Hashire sori yo
Kaze no you ni
Tsukimihara wo
Padoru Padoru
Hashire sori yo
Kaze no you ni
Tsukimihara wo
Padoru Padoru
      `)
  },  
}