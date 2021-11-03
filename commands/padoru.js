const fs = require('fs')
const math = require('./functions/math')
const embed = require('./functions/embed')
const argFilter = require('./functions/filter')
const economy = require('../economy')

module.exports = {
  commands: ['padoru','p'],
  cooldown: 60 * 60 * 2, // cooldown de 2 horas
  callback: async (message, arguments, text) => {

    var format = null
    var randomPadoru = null
    var rarityArray = [1, 2, 3, 4, 5]
    var weights = [45, 30, 16, 8, 1]

    const jsonString = fs.readFileSync('./padoru.json')
    const padoru = JSON.parse(jsonString)
    var padoruBaseList = []

    for(var i in padoru){
      padoruBaseList.push(padoru[i])
    }

    const rarityChosen = math.weighted_random(rarityArray, weights)
    
    padoruBaseList = padoruBaseList.filter(a => a.active === true).filter(r => r.rarity === rarityChosen)

    var count = padoruBaseList.length

    var randomPadoru = padoruBaseList[(math.randomNumberBetween(1,count))-1]
    
    if(message.author.username !== randomPadoru.owner){
      randomPadoru.footer = `Le has robado el padoru a ${randomPadoru.owner}`
    } else {
      randomPadoru.footer = `El ${randomPadoru.title} es tuyo en estos momentos`
    }
      randomPadoru.owner = message.author.username
      
      //lista de los padorus del usuario
      const myPadorus = await economy.myPadorus(message.author.id)

      /**
       * si el usuario no tiene el padoru se añade a su lista.
       * si ya lo tiene se suman monedas a su cuenta en funcion
       * de la rareza del padoru
       */
      const found = myPadorus.find(e => e === randomPadoru.id)

      var isNew = ''
      const coins = [5, 10, 20, 50, 200]

      if(found === undefined){
        const padoruAdd = await economy.newPadoru(message.author.id, randomPadoru.id)
        isNew = ':new:'
      } else {
        const coinsAdd = await economy.addCoins(message.author.id, coins[rarityChosen - 1])
        isNew = `+${coins[rarityChosen - 1]} PC`
      }
      
      // Damos forma al mensaje y posteriormente lo enviamos
      format = embed.embedCreator(randomPadoru, isNew)
      randomPadoru.footer = ''
      
      fs.writeFileSync('./padoru.json', JSON.stringify(padoru, null, 2), (err) => {
        if (err) console.log('Error writing file:', err)
      })

    message.channel.send(format)
  },
}