const math = require('../../functions/math')
const profile = require('../../schemas/profile')
const pad = require('./padoru')
const profile = require('../../databaseFunctions/dbProfile')
const newProfile = require('../../schemas/newProfile')


module.exports = {
  commands: ['roll', 'r'],
	description: 'Gasta los rolls extra que has ganado votando al bot con este comando',
	callback: async (message, arguments) => {
		const rarityArray = [1, 2, 3, 4, 5]
    const rarityWeights = [40, 31, 18, 9, 2]

		const extraArray = [4, 5]
		const extraWeights = [70, 30]

		const id = message.author.id
		const un = message.author.username

		

		if(!arguments[0]){
			message.reply('Escribe cuantos rolls vas a gastar. Formato: %roll <num>')
			return
		}

		const number = parseInt(arguments[0])

		if(number > 10 || number < 1){
			message.reply('El numero de Padorus debe estar entre 1 y 10')
			return
		}

		const jsonString = fs.readFileSync('./json/padoru.json')
    const padoru = JSON.parse(jsonString)
    var padoruBaseList = []

    for(var i in padoru){
      padoruBaseList.push(padoru[i])
    }

		padoruBaseList = padoruBaseList.filter(a => a.active === true)

		var myPadorus = await profile.myPadorus(id, un)

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
				rarityChosen.push(math.weighted_random(extraArray, extraWeights))
			} else {
				rarityChosen.push(math.weighted_random(rarityArray, rarityWeights))
			}
			
			padoruRareList = padoruBaseList.filter(r => r.rarity === rarityChosen[i])
			
			count = padoruRareList.length()
			padorus.push(padoruBaseList[(math.randomNumberBetween(1,count))-1])

			const found = myPadorus.find(e => e === padorus[i].id)

			if(found === undefined){
				newPadorus.push(padorus[i].id)
				isNew.push('🆕')
			} else {
				myCoins = myCoins + coins[rarityChosen[i] - 1]
				isNew.push(`+${coins[rarityChosen - 1]} PC`)
			}

			await profile
		}
		console.log(rarityChosen)

		await profile.addAll(id, newPadorus, myCoins)

		var index = 0
		var multipad = embed.embedCreator(padorus[index], isNew[index])

		mpmsg = await message.channel.send(multipad)
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
      mpmsg.edit(newMultipad)

    })

	}
}