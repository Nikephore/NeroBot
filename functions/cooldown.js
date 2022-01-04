const schedule = require('node-schedule')
const st = require('../databaseFunctions/dbSkillTree')
const profile = require('../databaseFunctions/dbProfile')

/**
 * Se ejecuta cada 2 horas
 * Reseteo de %padoru
 */
schedule.scheduleJob('0 */2 * * *', () => { resetRolls() })

async function resetRolls() {
  await st.resetRolls()
}

/**
 * Se ejecuta cada medianoche
 * Reseteo de %dailycoins
 */
schedule.scheduleJob('0 0 * * *', () => { resetDaily() })

async function resetDaily() {
  profile.resetDaily()
}

