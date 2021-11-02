function seriesFilter(padoruList, seriesList, text){

  function findSeries(obj){
    if(obj.alias.find(e => e.toLowerCase() === text.toLowerCase())){
      return true
    }

    return false
  }

  seriesList = seriesList.filter(findSeries)

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

module.exports = {
  seriesFilter
}