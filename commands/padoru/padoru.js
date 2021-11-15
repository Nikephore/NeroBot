const fs = require('fs')
const math = require('../../functions/math')
const embed = require('../../functions/embed')
const argFilter = require('../../functions/filter')
const mongo = require('../../functions/mongo')

module.exports = {
  commands: ['padoru','p'],
  description: 'Padoru aleatorio ¿te ha salido el que querías?',
  cooldown: 60 * 60 * 2, // cooldown de 2 horas
  callback: async (message) => {
    var randomPadoru = null
    var luckyPadoru = null
    var rarityArray = [1, 2, 3, 4, 5]
    var isNew = ''
    var luckyIsNew = ''
    var weights = [40, 31, 18, 9, 2]

    const jsonString = fs.readFileSync('./json/padoru.json')
    const padoru = JSON.parse(jsonString)
    var padoruBaseList = []

    for(var i in padoru){
      padoruBaseList.push(padoru[i])
    }

    console.log(message.author.username)

    const luck = math.luckyStrike(25)

    const rarityChosen = math.weighted_random(rarityArray, weights)
    
    padoruBaseList = padoruBaseList.filter(a => a.active === true).filter(r => r.rarity === rarityChosen)

    var count = padoruBaseList.length

    var randomPadoru = padoruBaseList[(math.randomNumberBetween(1,count))-1]

    if(luck){
      luckyPadoru = padoruBaseList[(math.randomNumberBetween(1,count))-1]

      if(message.author.username !==  luckyPadoru.owner){
        randomPadoru.footer = `Le has robado el padoru a ${luckyPadoru.owner}`
      } else {
        luckyPadoru.footer = `El ${luckyPadoru.title} es tuyo en estos momentos`
      }
    }
    
    if(message.author.username !== randomPadoru.owner){
      randomPadoru.footer = `Le has robado el padoru a ${randomPadoru.owner}`
    } else {
      randomPadoru.footer = `El ${randomPadoru.title} es tuyo en estos momentos`
    }
      randomPadoru.owner = message.author.username
      
      padorumsg = await stars(rarityChosen, message)

      //lista de los padorus del usuario
      var myPadorus = await mongo.myPadorus(message.author.id)
      

      isNew = await addPadoru(myPadorus, randomPadoru, rarityChosen, message)

      if(luck){
        console.log('LUCKY')
        myPadorus = await mongo.myPadorus(message.author.id)

        luckyIsNew = await addPadoru(myPadorus, luckyPadoru, rarityChosen, message)
      }
      
      // Damos forma al mensaje y posteriormente lo enviamos
      pad = embed.embedCreator(randomPadoru, isNew)
      randomPadoru.footer = ''

      if(luck){
        var newPad = embed.embedCreator(luckyPadoru, luckyIsNew)
        luckyPadoru.footer = ''
      }
      
      fs.writeFileSync('./json/padoru.json', JSON.stringify(padoru, null, 2), (err) => {
        if (err) console.log('Error writing file:', err)
      })

    padorumsg.edit('\u200B')
    padorumsg.edit(pad)

    if(luck){
      math.sleep(3000)
      newpadorumsg = await message.channel.send(':sparkles:LUCKY STRIKE!!:sparkles:\n')
      math.sleep(3000)
      newpadorumsg.edit(newPad)
    }
  },
}

async function stars(rarity, message){
  padorumsg = await message.channel.send('Escogiendo padoru...')
  await math.sleep(500)
  var star = ''
  for(i=0 ; i < rarity; i++){
    star = star + ':star:'
    padorumsg.edit(star)
    await math.sleep(1500)
  }

  return padorumsg
}

async function addPadoru(myPadorus, randomPadoru, rarityChosen, message){
  /**
  * si el usuario no tiene el padoru se añade a su lista.
  * si ya lo tiene se suman monedas a su cuenta en funcion
  * de la rareza del padoru
  */
  const found = myPadorus.find(e => e === randomPadoru.id)

  var isNew = ''
  const coins = [5, 10, 20, 50, 200]

  if(found === undefined){
    const padoruAdd = await mongo.newPadoru(message.author.id, randomPadoru.id)
    isNew = ':new:'
  } else {
    const coinsAdd = await mongo.addCoins(message.author.id, await coins[rarityChosen - 1])
    isNew = `+${coins[rarityChosen - 1]} PC`
  }

  return isNew
}

