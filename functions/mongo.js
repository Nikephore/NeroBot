const mongo = require('../mongo')
const newProfile = require('../schemas/newProfile')
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
          $inc: {rareTickets : 1}
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
          $inc: {superRareTickets : 1}
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
          $inc: {legendTickets : 1}
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



