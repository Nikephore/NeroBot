const fs = require('fs')
const embed = require('../../functions/embed')
const math = require('../../functions/math')
const padList = require('../../databaseFunctions/dbPadoru')

module.exports = {
  commands: ['infopadoru', 'ip'],
  description: 'Information of the specified Padoru. Short ver. %ip',
  maxArgs: 1,
  expectedArgs: '<Id>',
  callback: async (message, arguments, text) => {

    pad = await padList.getAll()

    const total = pad.length
    var info = parseInt(arguments[0])
    var name = text
    var infoPadoru = null

    if (!arguments[0]){
      infoPadoru = await padList.pick(1)
    } else {
      infoPadoru = await padList.pick(info)
      if(infoPadoru === undefined){
        message.channel.send('Ese padoru no existe')
        return
      }
    }

    console.log(infoPadoru)
    
    if(!infoPadoru.released){
      message.channel.send('Este padoru aún no ha salido de forma oficial, no se puede ver su información')
      return
    }

    infoPadoru.footer = `${infoPadoru.id}/${total}`

    let rs = math.rarityConvertEmoji(infoPadoru.rarity , 0)
    result = embed.embedCreator(infoPadoru, '', null, -1, null, rs)

    const prev = '<a:prev:901832158304415765>'
    const next = '<a:next:901832288378187816>'

    msg = await message.channel.send(result)
    msg.react("⬅️")
    msg.react("➡️")

    const filter = (reaction, user) => {
      return ["⬅️", "➡️"].includes(reaction.emoji.name) && (!user.bot)
    }

    editMessage(filter, infoPadoru, total, msg)
  }
}

async function editMessage(filter, infoPadoru, total, msg){

  const collector = msg.createReactionCollector(filter, {
      time: 120000,
  })

  collector.on('collect', async (reaction) => {
    var newId = null

		if (reaction.emoji.name === "⬅️") {
      
      newId = infoPadoru.id - 1
      if(newId === 0){
        newId = total
      }
		} else if (reaction.emoji.name === "➡️"){
      newId = infoPadoru.id + 1
      if(newId > total){
        newId = 1
      }
		}

    infoPadoru = await padList.pick(newId)

    if(!infoPadoru.released){
      msg.edit(`El padoru con id **${newId}** aún no ha salido de forma oficial, no se puede ver su información`)
    } else {
      msg.edit('ㅤ')
      infoPadoru.footer = `${newId}/${total}`
      let rs = math.rarityConvertEmoji(infoPadoru.rarity, 0)
      var newResult = embed.embedCreator(infoPadoru, '', null, -1, null, rs)
      msg.edit(newResult)
    }
  })
   
}