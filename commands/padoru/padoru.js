const fs = require('fs')
const math = require('../../functions/math')
const embed = require('../../functions/embed')
const profile = require('../../databaseFunctions/dbProfile')
const st = require('../../databaseFunctions/dbSkillTree')
const Duration = require('humanize-duration')

module.exports = {
  commands: ['padoru','p'],
  description: 'Padoru aleatorio ¿te ha salido el que querías?',
  cooldown: 60 * 60 * 2, // cooldown de 2 horas
  callback: async (message) => {
    const id = message.author.id
    var rarityArray = [1, 2, 3, 4, 5]
    var rarityWeights = [40, 31, 18, 9, 2]
    
    var sybariteArray = [2, 3, 4, 5]
    var sybariteWeights = [60, 25, 11, 4]

    const jsonString = fs.readFileSync('./json/padoru.json')
    const padoru = JSON.parse(jsonString)
    var padoruBaseList = []

    for(var i in padoru){
      padoruBaseList.push(padoru[i])
    }

    console.log(message.author.username)
    console.log(message.guild.name)

    const st = await st.getSkillTree(id)

    console.log(st)

    const luck = math.luckyStrike(25)

    const rarityChosen = math.weighted_random(rarityArray, rarityWeights)

    // lista de los padorus del usuario
    var myPadorus = await profile.myPadorus(id)
    
    var randomPadoru = await addPadoru(message, padoruBaseList, myPadorus, rarityChosen)

    if(!myPadorus.indexOf(randomPadoru.id)){
      myPadorus.push(randomPadoru.id)
    }

    if(luck){
      recursiveLuck(message, padoruBaseList, myPadorus, rarityChosen + 1)
    }

    fs.writeFileSync('./json/padoru.json', JSON.stringify(padoru, null, 2), (err) => {
      if (err) console.log('Error writing file:', err)
    })
  },
}

async function recursiveLuck(message, padoruBaseList, myPadorus, rarityChosen){
  math.sleep(2000)
  newpadorumsg = await message.channel.send(':sparkles:LUCKY STRIKE!!:sparkles:\n')
  math.sleep(3000)
  await addPadoru(message, padoruBaseList, myPadorus, rarityChosen)

  var lucky = math.luckyStrike(25)

  if(lucky){
    recursiveLuck(message, padoruBaseList, myPadorus, rarityChosen + 1)
  }

  return
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
    randomPadoru.footer = `${message.author.username} le ha robado el padoru a ${randomPadoru.owner}`
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
  const coins = [25, 75, 150, 500, 2000]
  var bonus = 0

  if(found === undefined){
    await profile.newPadoru(id, randomPadoru.id)
    isNew = ':new:'
  } else {

    if(math.luckyStrike(20)){
      bonus = coins[rarityChosen - 1] * 4
      isNew = 'BONUS!! '
    }

    await profile.addCoins(id, coins[rarityChosen - 1])
    isNew = isNew + `+${coins[rarityChosen - 1] + bonus} PC`
  }

  var pad = embed.embedCreator(randomPadoru, isNew)
  randomPadoru.footer = ''

  channel.send.message(pad)

  return randomPadoru
}

