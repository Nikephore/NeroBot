const mongo = require('../mongo')
const newProfileSchema = require('../schemas/newProfile')

/* Constante para crear una entrada en la BD si esta
   no existe previamente */
const newentry = {upsert: true, new: true}

/* Funciones para gestionar los Tickets */
module.exports.addTicket = async (userId, username) => {
  return await mongo().then(async mongoose => {
    try {
      await newProfileSchema.findOneAndUpdate(
			{	userId },
      {
        username,
        $inc: {tickets : 1}
      },
      {	newentry })
      
    } finally {
      mongoose.connection.close()
    }
  })
}

module.exports.myTickets = async (userId, username) => {
  return await mongo().then(async mongoose => {
    try {

      const result = await newProfileSchema.findOneAndUpdate({userId},
      {
        username,
      },
      {
        newentry
      })

      return result.tickets
      
    } finally {
      mongoose.connection.close()
    }
  })
}

module.exports.removeTicket = async (userId, username, number) => {
  return await mongo().then(async mongoose => {
    try {

      await newProfileSchema.findOneAndUpdate({
        userId
      },
      {
        username,
        $inc: {tickets : -number}
      },
      {
        newentry
      })

    } finally {
      mongoose.connection.close()
    }
  })
}

/* Funciones para gestionar los rolls*/
module.exports.addRoll = async (userId, number) => {
  return await mongo().then(async mongoose => {
    try {

      await newProfileSchema.findOneAndUpdate({userId},
      {
        $inc:{"rolls.padoruRolls" : number}
      },
      {
        upsert: true,
        new: true
      })

      return
      
    } finally {
      mongoose.connection.close()
    }
  })
}

module.exports.myRolls = async (userId, username) => {
  return await mongo().then(async mongoose => {
    try {
      const result = await newProfileSchema.findOneAndUpdate({userId},
      {
        username,
      },
      {
        newentry
      })

      return result.rolls.padoruRolls
      
    } finally {
      mongoose.connection.close()
    }
  })
}