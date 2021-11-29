const mongo = require('../databaseFunctions/dbNewProfile')
const schedule = require('node-schedule')

/* Cada hora se ejecuta la funcion hourly */
//schedule.scheduleJob('0 0 * * *', () => { hourly() })

let rolled = {a : "test"}

/* Suma un roll cuando el usuario vota en la pagina top.gg*/
async function addRoll(user, weekend) {

  if(weekend){
    await mongo.addRoll(user, 2)
    return
  } 
  
  await mongo.addRoll(user, 1)
}

/* Gestiona el cooldown personalizado de los usuarios 
function hourly(){
  for (const [key, value] of Object.entries(rolled)) {
    value--
    if(value === 0){
      delete rolled[key]
    }
  }
}
*/


module.exports = {
  addRoll,
}