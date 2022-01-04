const math = require('../../functions/math')
const profile = require('../../databaseFunctions/dbProfile')

module.exports = {
    commands: ['remove'],
    description: 'remove',
    callback: async (message) => {

    await profile.reset()

    message.reply("Actualizada la base de datos correctamente")
  }      
}
