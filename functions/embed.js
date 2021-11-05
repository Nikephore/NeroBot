const Discord = require("discord.js")

function embedCreator(element, isNew){
  const embed = new Discord.MessageEmbed()
    .setAuthor(element.title)
    .setTitle(`${element.raritystar}  ${isNew}`)
    .setDescription(element.description)
    .setImage(element.image)
    .setColor(element.color)
    .setFooter(element.footer)
  
  embed.addField('\u200B', `Artist: ${element.artist}`)
  return embed
}


module.exports = {embedCreator}