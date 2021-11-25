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

function resetMidnight(){
  
}

module.exports = {
  seriesFilter,
  rarityFilter,
  padoruInSeriesFilter
}