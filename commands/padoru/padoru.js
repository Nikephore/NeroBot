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
    var rarityArray = [1, 2, 3, 4, 5]
    var rarityWeights = [40, 31, 18, 9, 2]

    const jsonString = fs.readFileSync('./json/padoru.json')
    const padoru = JSON.parse(jsonString)
    var padoruBaseList = []

    for(var i in padoru){
      padoruBaseList.push(padoru[i])
    }

    console.log(message.author.username)

    const luck = math.luckyStrike(25)

    const rarityChosen = math.weighted_random(rarityArray, rarityWeights)

    // lista de los padorus del usuario
    var myPadorus = await mongo.myPadorus(message.author.id)
    
    var randomPadoru = addPadoru(message, padoruBaseList, myPadorus, rarityChosen)

    if(!myPadorus.indexOf(randomPadoru.id)){
      myPadorus.push(randomPadoru.id)
    }

    if(luck){
      math.sleep(2000)
      newpadorumsg = await message.channel.send(':sparkles:LUCKY STRIKE!!:sparkles:\n')
      math.sleep(3000)
      addPadoru(message, padoruBaseList, myPadorus, rarityChosen + 1)
    }

    fs.writeFileSync('./json/padoru.json', JSON.stringify(padoru, null, 2), (err) => {
      if (err) console.log('Error writing file:', err)
    })
  },
}

async function stars(rarity, message, onemore){
  padorumsg = await message.channel.send('Escogiendo padoru...')
  await math.sleep(500)

  var star = ''
  var star2 = ''
  for(i=0 ; i < rarity; i++){
    star = star + ':star:'
    star2 = star2 + ':star2:'
    padorumsg.edit(star)
    await math.sleep(1500)
  }
  if(onemore && rarity > 2){
    padorumsg.edit(star2)
  }
  
  return padorumsg
}

async function addPadoru(message, padoruBaseList, myPadorus, rarityChosen){
    
  // control de errores
  if(rarityChosen > 5){
    rarityChosen = 5
  }

  padoruBaseList = padoruBaseList.filter(a => a.active === true).filter(r => r.rarity === rarityChosen)

  var count = padoruBaseList.length

  var randomPadoru = padoruBaseList[(math.randomNumberBetween(1,count))-1]
  
  if(message.author.username !== randomPadoru.owner){
    randomPadoru.footer = `Le has robado el padoru a ${randomPadoru.owner}`
  } else {
    randomPadoru.footer = `El ${randomPadoru.title} es tuyo en estos momentos`
  }

  randomPadoru.owner = message.author.username

  /**
  * si el usuario no tiene el padoru se añade a su lista.
  * si ya lo tiene se suman monedas a su cuenta en funcion
  * de la rareza del padoru
  */
  const found = myPadorus.find(e => e === randomPadoru.id)

  var isNew = ''
  const coins = [5, 10, 20, 50, 200]

  if(found === undefined){
    padorumsg = await stars(rarityChosen, message, true)
    await mongo.newPadoru(message.author.id, randomPadoru.id)
    isNew = ':new:'
  } else {
    padorumsg = await stars(rarityChosen, message, false)
    await mongo.addCoins(message.author.id, coins[rarityChosen - 1])
    isNew = `+${coins[rarityChosen - 1]} PC`
  }

  var pad = embed.embedCreator(randomPadoru, isNew)
  randomPadoru.footer = ''

  padorumsg.edit('\u200B')
  padorumsg.edit(pad)

  return randomPadoru
}

