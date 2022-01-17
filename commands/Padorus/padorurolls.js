const math = require('../../functions/math')
const profile = require('../../databaseFunctions/dbProfile')
const newProfile = require('../../databaseFunctions/dbNewProfile')
const embed = require('../../functions/embed')
const padList = require('../../databaseFunctions/dbPadoru')
const st = require('../../databaseFunctions/dbSkillTree')

module.exports = {
  commands: ['roll', 'r'],
	description: 'Gasta los rolls extra que has ganado votando al bot con este comando',
	callback: async (message, arguments) => {
    const rar = {1:0.37, 2:0.3, 3:0.2, 4:0.1, 5:0.03}
    const extraRar = {4:0.75, 5:0.25}

    const sybarar = {2:0.6, 3:0.25, 4:0.11, 5:0.04}

		const id = message.author.id
		const un = message.author.username

		if(!arguments[0]){
			message.reply('Write how many rolls you are going to spend. Obtain more rolls with %vote. If you roll 10 Padorus at once the last one will be a 4 or 5 stars Padoru.\n Format: %roll <num>')
			return
		}

    const sk = await st.getSkillTree(id, un)

		const number = parseInt(arguments[0])

    const rolls = await newProfile.myRolls(id, un)


		if(number > 10 || number < 1){
			message.reply('The number must be between 1 y 10')
			return
		}

    if(rolls < number){
      message.reply(`You don't have enough rolls`)
      return
    }

		var pad = await padList.getAll()

		var myPadorus = await profile.myPadorus(id, message.author.username)

    pad = pad.filter(a => a.active === true)

		var rarityChosen = []
		var padorus = []
		var padoruRareList = []
		var newPadorus = []
		var isNew = []
    var extra = []
		const coins = [50, 150, 450, 1500, 3000, 15000]
		var myCoins = 0
		
		for(i = 0; i < number; i++){

			// Aseguramos que el decimo roll sea de 4 estrellas o mas
			if(i === 9){
        console.log('Decima ronda')
				rarityChosen.push(parseInt(math.weightedRandom(extraRar)))

			} else {
				rarityChosen.push(parseInt(math.weightedRandom(rar)))

			}
			
			var padoruRareList = pad.filter(r => r.rarity === rarityChosen[i])
			
			count = padoruRareList.length
			padorus.push(padoruRareList[(math.randomNumberBetween(1,count))-1])

			const found = myPadorus.pp.find(e => e.id === padorus[i].id)

			if(found === undefined){
				newPadorus.push(padorus[i].id)
				isNew.push('🆕')
        extra.push(0)

			} else {
        extra.push(found.rarity)
				myCoins = myCoins + coins[rarityChosen[i] - 1 + found.rarity]
				isNew.push(`+${coins[rarityChosen[i] - 1 + found.rarity]} PC`)
			}

		}
		console.log(rarityChosen)

    await profile.newPadorus(id, newPadorus)
		await profile.addCoins(id, myCoins)

		var index = 0
    const rs = math.rarityConvertEmoji(rarityChosen[index], extra[index])
		var multipad = embed.embedCreator(padorus[index], isNew[index], null, -1, null, rs)

    multipad.setFooter(`${index+1}/${number}`)

		mpmsg = await message.channel.send(multipad)

    await newProfile.addRoll(id, -number)

    if(number === 1){
      return
    }

		mpmsg.react('⬅️')
		mpmsg.react('➡️')


    editMessage(mpmsg, padorus, index, isNew, extra, number)

	}
}

async function editMessage(mpmsg, padorus, index, isNew, extra, number){

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

    const rs = math.rarityConvertEmoji(padorus[index].rarity, extra[index])

		var newMultipad = embed.embedCreator(padorus[index], isNew[index], null, -1, null, rs)
    newMultipad.setFooter(`${index+1}/${number}`)

    mpmsg.edit(newMultipad)
    })
}