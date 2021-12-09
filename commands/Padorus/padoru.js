const fs = require('fs')
const math = require('../../functions/math')
const embed = require('../../functions/embed')
const profile = require('../../databaseFunctions/dbProfile')
const st = require('../../databaseFunctions/dbSkillTree')
const Duration = require('humanize-duration')
const schedule = require('node-schedule')


schedule.scheduleJob('0 */2 * * *', () => { resetRolls() })

module.exports = {
  commands: ['padoru', 'p'],
  description: 'Padoru aleatorio ¿te ha salido el que querías?',
  callback: async (message) => {
    const id = message.author.id
    const rar = {1:0.4, 2:0.31, 3:0.18, 4:0.9, 5:0.02}
    const bannerOrNot = math.randomNumberBetween(1, 100)
    const bannerRar = {3:0.6, 4:0.3, 5:0.1}
    const sybatiterar = {2:0.6, 3:0.25, 4:0.11, 5:0.04}

    const jsonString = fs.readFileSync('./json/padoru.json')
    const padoru = JSON.parse(jsonString)
    var padoruBaseList = []
    var rarityChosen = null

    let remaining = Duration(math.normalizeDate(2, 2) * 60000, {units: ['h', 'm'], maxDecimalPoints: 0, language: 'en'})

    const sk = await st.getSkillTree(id, message.author.username)

    if(sk.prolls.numrolls === 0){
      message.channel.send(`Your next roll is in **${remaining}**. You can vote Nero to obtain more rolls with **%vote**`)
      return
    }

    await st.prollsMinusOne(id, message.author.username)

    for(var i in padoru){
      padoruBaseList.push(padoru[i])
    }

    console.log(message.author.username)
    console.log(message.guild.name)

    const luck = math.luckyStrike(sk.problucky.prob)
    const sybarite = sk.sybarite

    // 10 percent of chossing a banner padoru
    if(bannerOrNot <= 90) {
      if (sybarite){
        rarityChosen = parseInt(math.weightedRandom(sybatiterar))
      } else {
      rarityChosen = parseInt(math.weightedRandom(rar))
      }
    } else {
      rarityChosen = parseInt(math.weightedRandom(bannerRar))

      padoruBaseList = padoruBaseList.filter(a => a.banner === true)
    }
    
    // lista de los padorus del usuario
    var myPadorus = await profile.myPadorus(id, message.author.username)
    
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
  addPadoru
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
  const id = message.author.id
    
  // control de errores
  if(rarityChosen > 5){
    rarityChosen = 5
  }

  await stars(rarityChosen, message)

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

    await profile.addCoins(message.author.id, coins[rarityChosen - 1])
    isNew = isNew + `+${coins[rarityChosen - 1] + bonus} PC`
  }

  var pad = embed.embedCreator(randomPadoru, isNew)
  randomPadoru.footer = ''

  message.channel.send(pad)

  return randomPadoru
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

  padorumsg.delete()
}

async function resetRolls() {
  await st.resetRolls()
}
