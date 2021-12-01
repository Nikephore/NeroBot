function randomNumberBetween(min, max){
  return Math.floor(Math.random() * (max - min + 1) ) + min
}

100 - 1 + 1

function luckyStrike(num){
  lucky = Math.floor(Math.random() * num)

  // Probabilidad de 1/num de que devuelva true
  if(lucky === 1){
    return true
  }

  return false
}

function weightedRandom(prob) {
  let i, sum=0, r=Math.random();

  for (i in prob) {
    sum += prob[i];
    if (r <= sum) return i;
  }
}

function rarityConvertAscii(rarity){
  var ret = ""
  for(var i = 0; i < rarity; i++){
      ret += "☆"
  }
  return ret
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function minsToMidnight() {
  var now = new Date();
  var then = new Date(now);
  then.setHours(24, 0, 0, 0);
  return (then - now) / 6e4;
}

module.exports = {
  randomNumberBetween,
  luckyStrike,
  rarityConvertAscii,
  sleep,
  minsToMidnight,
  weightedRandom
}
