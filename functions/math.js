function randomNumberBetween(min, max){
  return Math.floor(Math.random() * (max - min + 1) ) + min
}

function weighted_random(items, weights) {
    var i;

    for (i = 0; i < weights.length; i++)
        weights[i] += weights[i - 1] || 0;
    
    var random = Math.random() * weights[weights.length - 1];
    
    for (i = 0; i < weights.length; i++)
        if (weights[i] > random)
            break;
    
    return items[i];
}

function rarityConvertAscii(rarity){
  var ret = ""
  for(var i = 0; i < rarity; i++){
      ret += "☆"
  }
  return ret
}

module.exports = {
  randomNumberBetween,
  weighted_random,
  rarityConvertAscii
}
