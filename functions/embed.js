const Discord = require("discord.js")
const math = require("../functions/math")

function embedCreator(element, isNew, name, dead, life, rs){

  var footer = ''

  console.log(life)

  if(dead === 0){
    footer = `${name} ⚔️🛡️ ${element.owner.username}  |  Life: ${math.lifeConvertEmoji(life)}`
  } else if (dead === 1) {
    footer = `${name} ⚔️⚔️ ${element.owner.username}  |  You own now this Padoru`
  } else if (dead == 2) {
    footer = `This Padoru is already yours. It restores some health points`
  } else {
    footer = `Owner: ${element.owner.username}  |  Life: ${math.lifeConvertEmoji(element.life)}`
  }
  
  const embed = new Discord.MessageEmbed()
    .setAuthor(`${element.title}    ${isNew}`)
    .setTitle(rs)
    .setDescription(element.description)
    .setImage(element.image)
    .setColor(element.color)
    .setFooter(footer)
  
  embed.addField('\u200B', `Artist: ${element.artist}`)
  return embed
}


module.exports = {embedCreator}