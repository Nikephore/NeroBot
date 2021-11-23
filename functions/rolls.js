const mongo = require('../functions/mongo')

async function addRoll(user, weekend) {

  if(weekend){
    await mongo.addRoll(user, 2)
    return
  } 
  
  await mongo.addRoll(user, 1)
}

module.exports = {
  addRoll
}