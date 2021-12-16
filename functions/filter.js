function padoruInSeriesFilter(padoruList, seriesList, text){

  seriesList = seriesFilter(seriesList, text)

  function findpadoru(obj){
    if(seriesList.some(
      e => obj.series.includes(e.name))){
        return true
      } else {
        return false
      }
  }

  padoruList = padoruList
    .filter(findpadoru)
    .filter(a => a.released === true)

  return padoruList
}

function rarityFilter(padoruList, rarity){
  padoruList = padoruList
    .filter(a => a.rarity === rarity)
    .filter(a => a.released === true)

  return padoruList
}

function seriesFilter(seriesList, text){
  
  function findSeries(obj){
    if(obj.alias.find(e => e.toLowerCase() === text.toLowerCase())){
      return true
    }

    return false
  }

  seriesList = seriesList.filter(findSeries)

  return seriesList
}

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

var SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

function nFormatter(number){

    // what tier? (determines SI symbol)
    var tier = Math.log10(Math.abs(number)) / 3 | 0;

    // if zero, we don't need a suffix
    if(tier == 0) return number;

    // get suffix and determine scale
    var suffix = SI_SYMBOL[tier];
    var scale = Math.pow(10, tier * 3);

    // scale the number
    var scaled = number / scale;

    // format number and add suffix
    return scaled.toFixed(1) + suffix;
}

module.exports = {
  seriesFilter,
  rarityFilter,
  padoruInSeriesFilter,
  toTitleCase,
  nFormatter
}