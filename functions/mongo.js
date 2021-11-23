const mongo = require('../mongo')
const newProfileSchema = require('../schemas/newProfile')
const profileSchema = require('../schemas/profile.js')
const testSchema = require('../schemas/test.js')

module.exports = (client) => {}

module.exports.updateProfile = async (userId, padorupedia, username) => {
  return await mongo().then(async mongoose => {
    try {

      const after = await testSchema.findOneAndUpdate({
        userId
      },
      {
        padorupedia,
        username
      },
      {
        upsert: true,
        new: true
      })

    } finally {
      mongoose.connection.close()
    }
  })
}

module.exports.addCoins = async (userId, padoruCoins) => {
  return await mongo().then(async mongoose => {
    try {

      const result = await profileSchema.findOneAndUpdate({
        userId
      },
      {
        userId,
        $inc: {
          padoruCoins
        },
      },
      {
        upsert: true,
        new: true
      })

    } finally {
      mongoose.connection.close()
    }

    return padoruCoins
  })
}

module.exports.getCoins = async (userId) => {
  return await mongo().then(async mongoose => {
    try {
      console.log('Running findOne()')

      const result = await profileSchema.findOne({
        userId
      })

      let padoruCoins = 0
      let padoruCount = 0
      let padorupedia = []
      if(result){
        padoruCoins = result.padoruCoins
        padorupedia = result.padorupedia
        padoruCount = result.padoruCount
      } else {
        await new profileSchema({
          userId,
          padoruCoins,
          padorupedia,
          padoruCount
        }).save()
      }

      return padoruCoins
      
    } finally {
      mongoose.connection.close()
    }
  })
}

module.exports.newPadoru = async (userId, padorupedia) => {
  return await mongo().then(async mongoose => {
    try {
      
      const result = await profileSchema.findOneAndUpdate({
        userId
      },
      {
        userId,
        $push: {
          padorupedia
        }
      },
      {
        upsert: true,
        new: true
      })

      return padorupedia
      
    } finally {
      mongoose.connection.close()
    }
  })
}

module.exports.myPadorus = async (userId) => {
  return await mongo().then(async mongoose => {
    try {
      console.log('Running findOne()')

      const result = await profileSchema.findOne({
        userId
      })

      let padoruCoins = 0
      let padoruCount = 0
      let padorupedia = []
      if(result){
        padoruCoins = result.padoruCoins
        padoruCount = result.padoruCount
        padorupedia = result.padorupedia
      } else {
        await new profileSchema({
          userId,
          padoruCoins,
          padorupedia,
          padoruCount
        }).save()
      }

      return padorupedia
      
    } finally {
      mongoose.connection.close()
    }
  })
}

module.exports.erase = async (userId, padorupedia) => {
  return await mongo().then(async mongoose => {
    try {
      console.log('Running findOne()')

      const result = await profileSchema.findOneAndUpdate({
        userId
      },
      {
        userId,
        $unset: {
          padorupedia
        }
      },
      {
        upsert: true,
        new: true
      })

      return padorupedia
      
    } finally {
      mongoose.connection.close()
    }
  })
}

module.exports.addTicket = async (userId, username, rarity) => {
  return await mongo().then(async mongoose => {
    try {

      if(rarity === 3){
        await newProfileSchema.findOneAndUpdate({
          userId
        },
        {
          username,
          $inc: {"tickets.rareTickets" : 1}
        },
        {
          upsert: true,
          new: true
        })
      }

      if(rarity === 4){
        await newProfileSchema.findOneAndUpdate({
          userId
        },
        {
          username,
          $inc: {"tickets.superRareTickets" : 1}
        },
        {
          upsert: true,
          new: true
        })
      }

      if(rarity === 5){
        await newProfileSchema.findOneAndUpdate({
          userId
        },
        {
          username,
          $inc: {"tickets.legendTickets" : 1}
        },
        {
          upsert: true,
          new: true
        })
      }

      
    } finally {
      mongoose.connection.close()
    }
  })
}

module.exports.myTickets = async (userId, username) => {
  return await mongo().then(async mongoose => {
    try {

      const profile = await profileSchema.findOne({userId})

      const result = await newProfileSchema.findOneAndUpdate({userId},
      {
        username,
        $set: {padorupedia : profile.padorupedia},
        $set: {padoruCoins : profile.padoruCoins},
        $set: {numPadoru : profile.padorupedia.length}
      },
      {
        upsert: true,
        new: true
      })

      return result.tickets
      
    } finally {
      mongoose.connection.close()
    }
  })
}

module.exports.removeTicket = async (userId, username, rarity) => {
  return await mongo().then(async mongoose => {
    try {

      if(rarity === 3){
        await newProfileSchema.findOneAndUpdate({
          userId
        },
        {
          username,
          $inc: {"tickets.rareTickets" : -1}
        },
        {
          upsert: true,
          new: true
        })
      }

      if(rarity === 4){
        await newProfileSchema.findOneAndUpdate({
          userId
        },
        {
          username,
          $inc: {"tickets.superRareTickets" : -1}
        },
        {
          upsert: true,
          new: true
        })
      }

      if(rarity === 5){
        await newProfileSchema.findOneAndUpdate({
          userId
        },
        {
          username,
          $inc: {"tickets.legendTickets" : -1}
        },
        {
          upsert: true,
          new: true
        })
      }

      
    } finally {
      mongoose.connection.close()
    }
  })
}

module.exports.addRoll = async (userId, number) => {
  return await mongo().then(async mongoose => {
    try {

      const profile = await profileSchema.findOne({userId})

      const result = await newProfileSchema.findOneAndUpdate({userId},
      {
        $set: {padorupedia : profile.padorupedia},
        $set: {padoruCoins : profile.padoruCoins},
        $set: {numPadoru : profile.padorupedia.length},
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

      const profile = await profileSchema.findOne({userId})

      const result = await newProfileSchema.findOneAndUpdate({userId},
      {
        username,
        $set: {padorupedia : profile.padorupedia},
        $set: {padoruCoins : profile.padoruCoins},
        $set: {numPadoru : profile.padorupedia.length}
      },
      {
        upsert: true,
        new: true
      })

      return result.rolls.padoruRolls
      
    } finally {
      mongoose.connection.close()
    }
  })
}
