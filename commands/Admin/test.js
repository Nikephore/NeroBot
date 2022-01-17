const math = require('../../functions/math')
const profile = require('../../databaseFunctions/dbProfile')
const st = require('../../databaseFunctions/dbSkillTree')
const padList = require('../../databaseFunctions/dbPadoru')

module.exports = {
    commands: ['test'],
    description: 'test',
    callback: async (message) => {
    var padorus = await padList.getAll()

    const rar = [1, 2, 3, 4, 5]
    var freq = []

    rar.forEach(element => freq.push(padorus.filter((obj) => obj.rarity === element).length))
      
    const total = []

    var i = 0
    for (e in rar){
      total.push({ow: rar[i], fr: freq[i]})
      i++
    }

    total.sort((a,b) => (a.fr < b.fr) ? 1 : ((b.fr < a.fr) ? -1 : 0))

    console.log(total)

    message.reply(total)
    

   await profile.resetDaily()
   await st.resetRolls()
  }      
}
