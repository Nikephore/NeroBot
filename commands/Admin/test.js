const math = require('../../functions/math')
const profile = require('../../databaseFunctions/dbProfile')

module.exports = {
    commands: ['test'],
    description: 'test',
    callback: async (message) => {

    await profile.dumpdc()

    message.reply("padorupedias actualizadas")
  }      
}
