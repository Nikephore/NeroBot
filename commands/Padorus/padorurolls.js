const fs = require('fs')
const math = require('../../functions/math')
const profile = require('../../databaseFunctions/dbProfile')
const newProfile = require('../../databaseFunctions/dbNewProfile')
const embed = require('../../functions/embed')


module.exports = {
  commands: ['roll', 'r'],
	description: 'Gasta los rolls extra que has ganado votando al bot con este comando',
	callback: async (message, arguments) => {
    const rar = {1:0.4, 2:0.31, 3:0.18, 4:0.9, 5:0.02}
    const extraRar = {4:0.8, 5:0.2}

		const id = message.author.id
		const un = message.author.username

		if(!arguments[0]){
			message.reply('Write how many rolls you are going to spend. Obtain more rolls with %vote\n Format: %roll <num>')
			return
		}

		const number = parseInt(arguments[0])

    const rolls = await newProfile.myRolls(id, un)

		if(number > 10 || number < 1){
			message.reply('The number must be between 1 y 10')
			return
		}

    if(rolls < number){
      message.reply('No tienes suficientes rolls')
      return
    }

		const jsonString = fs.readFileSync('./json/padoru.json')
    const padoru = JSON.parse(jsonString)
    var padoruBaseList = []

    for(var i in padoru){
      padoruBaseList.push(padoru[i])
    }

		var myPadorus = await profile.myPadorus(id, message.author.username)

    padoruBaseList = padoruBaseList.filter(a => a.active === true)

		var rarityChosen = []
		var padorus = []
		var padoruRareList = []
		var newPadorus = []
		var isNew = []
		const coins = [25, 75, 150, 500, 2000]
		var myCoins = 0
		
		for(i = 0; i < number; i++){

			// Aseguramos que el decimo roll sea de 4 estrellas o mas
			if(i === 9){
        console.log('Decima ronda')
				rarityChosen.push(parseInt(math.weightedRandom(extraRar)))

			} else {
				rarityChosen.push(parseInt(math.weightedRandom(rar)))

			}
			
			var padoruRareList = padoruBaseList.filter(r => r.rarity === rarityChosen[i])
			
			count = padoruRareList.length
			padorus.push(padoruRareList[(math.randomNumberBetween(1,count))-1])

			const found = myPadorus.find(e => e === padorus[i].id)

			if(found === undefined){
				newPadorus.push(padorus[i].id)
				isNew.push('🆕')

			} else {
				myCoins = myCoins + coins[rarityChosen[i] - 1]
				isNew.push(`+${coins[rarityChosen[i] - 1]} PC`)
			}

		}
		console.log(rarityChosen)

		await profile.addAll(id, newPadorus, myCoins)

		var index = 0
		var multipad = embed.embedCreator(padorus[index], isNew[index])

    multipad.setFooter(`${index+1}/${number}`)

		mpmsg = await message.channel.send(multipad)

    await newProfile.addRoll(id, -number)

    if(number === 1){
      return
    }

		mpmsg.react('⬅️')
		mpmsg.react('➡️')

		const filter = (reaction, user) => {
      return ["⬅️", "➡️"].includes(reaction.emoji.name) && (!user.bot)
    }

    const collector = mpmsg.createReactionCollector(filter, {
        time: 120000,
    })

    collector.on('collect', (reaction) => {

		  if (reaction.emoji.name === "⬅️") {
        
        index--
        if(index === -1){
          index = number - 1
        }
		  } else if (reaction.emoji.name === "➡️"){

				index++
        if(index === number){
          index = 0
        }
		  }
			
			var newMultipad = embed.embedCreator(padorus[index], isNew[index])
      newMultipad.setFooter(`${index+1}/${number}`)
      mpmsg.edit(newMultipad)

    })

	}
}