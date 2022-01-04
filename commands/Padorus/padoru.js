const fs = require('fs')
const math = require('../../functions/math')
const embed = require('../../functions/embed')
const profile = require('../../databaseFunctions/dbProfile')
const st = require('../../databaseFunctions/dbSkillTree')
const Duration = require('humanize-duration')
const padList = require('../../databaseFunctions/dbPadoru')

module.exports = {
  commands: ['padoru', 'p'],
  description: 'Padoru random. Did you get the one you wanted?. Short ver %p',
  callback: async (message) => {
    const id = message.author.id
    const rar = {1:0.37, 2:0.3, 3:0.2, 4:0.1, 5:0.03}
    const bannerOrNot = math.randomNumberBetween(1, 100)
    const bannerRar = {3:0.45, 4:0.30, 5:0.15}
    const sybatiterar = {2:0.5, 3:0.3, 4:0.15, 5:0.05}

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
    const sybarite = sk.sybarite.syba

    // 10 percent of chossing a banner padoru
    if(bannerOrNot <= 90) {
      if (sybarite){
        console.log('syba')
        rarityChosen = parseInt(math.weightedRandom(sybatiterar))
      } else {
        console.log('nosyba')
      rarityChosen = parseInt(math.weightedRandom(rar))
      }
    } else {
      rarityChosen = parseInt(math.weightedRandom(bannerRar))

      padoruBaseList = padoruBaseList.filter(a => a.banner === true)
    }
    
    // lista de los padorus del usuario
    var myPadorus = await profile.myPadorus(id, message.author.username)

    var randomPadoru = await addPadoru(message, padoruBaseList, myPadorus, rarityChosen, sk)

    console.log(randomPadoru.title)

    /*
    if(!myPadorus.pp.indexOf(randomPadoru.id)){
      myPadorus.push(randomPadoru.id)
    }
    */
    
    if(luck){
      recursiveLuck(message, padoruBaseList, myPadorus, rarityChosen + 1, sk)
    }
    
  },
  addPadoru
}

async function recursiveLuck(message, padoruBaseList, myPadorus, rarityChosen, sk){
  math.sleep(2000)
  var newpadorumsg = await message.channel.send(':sparkles:LUCKY STRIKE!!:sparkles:\n')

  math.sleep(3000)

  await addPadoru(message, padoruBaseList, myPadorus, rarityChosen, sk)

  var lucky = math.luckyStrike(25)

  if(lucky){
    recursiveLuck(message, padoruBaseList, myPadorus, rarityChosen + 1, sk)
  }

  return
}

async function addPadoru(message, padoruBaseList, myPadorus, rarityChosen, sk){
  const id = message.author.id

  var padorumsg = await message.channel.send('Escogiendo padoru...')  

  // control de errores
  if(rarityChosen > 6){
    rarityChosen = 5
  }

  console.log("Rarity: " + rarityChosen)

  var randomPadoru = await padList.pickOne(rarityChosen)
  console.log(randomPadoru)

  /**
  * si el usuario no tiene el padoru se añade a su lista.
  * si ya lo tiene se suman monedas a su cuenta en funcion
  * de la rareza del padoru
  */
  const found = myPadorus.pp.find(e => e.id === randomPadoru.id)

  var isNew = ''
  const coins = [50, 150, 450, 1500, 3000, 15000]
  var bonus = 0
  var finalmsg = null
  var extrarar = 0

  if(found === undefined){
    finalmsg = await stars(rarityChosen, padorumsg, true)

    await profile.newPadoru(id, randomPadoru.id)
    isNew = '**NEW**'

  } else {
    finalmsg = await stars(rarityChosen, padorumsg, false)

    extrarar = found.rarity
    const finalrarity = rarityChosen + extrarar
    

    if(math.luckyStrike(20)){
      bonus = coins[finalrarity - 1] * 3
      isNew = 'BONUS!! '
    }

    await profile.addCoins(message.author.id, coins[finalrarity - 1] + bonus)
    isNew = isNew + `+${coins[finalrarity - 1] + bonus} PC`
  }

  var attack = 0
  var life = 0
  if(randomPadoru.owner.userId === message.author.id) {
    await padList.attack(randomPadoru.id, message.author.id, message.author.username, 0.5)
    attack = 2
  } else{
    if(sk.attack.value >= randomPadoru.life){
      await padList.attackFull(randomPadoru.id, message.author.id, message.author.username, randomPadoru.rarity)

      attack = 1
    } else {
    
      await padList.attack(randomPadoru.id, message.author.id, message.author.username, -sk.attack.value)

      life = randomPadoru.life - sk.attack.value
    }
  }

  const rs = math.rarityConvertEmoji(rarityChosen, extrarar)
  
  var pad = embed.embedCreator(randomPadoru, isNew, message.author.username, attack, life, rs)
  
  finalmsg.edit(pad)

  return randomPadoru
}

async function stars(rarity, message, isNew){
  
  await math.sleep(500)
  var star = ''

  for(i=0 ; i < rarity; i++){
    star = star + ':star:'
    message.edit(star)
    await math.sleep(1000)
  }
  if(isNew){
    message.edit(':star2:'.repeat(rarity))
    await math.sleep(1000)
  }
  message.edit('⠀')
  return message
}
