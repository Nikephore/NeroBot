const mongo = require('./mongo')
const profileSchema = require('./schemas/profile.js')

module.exports = (client) => {}

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
      let padorupedia = []
      if(result){
        padoruCoins = result.padoruCoins
        padorupedia = result.padorupedia
      } else {
        await new profileSchema({
          userId,
          padoruCoins,
          padorupedia
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
      let padorupedia = []
      if(result){
        padoruCoins = result.padoruCoins
        padoruCount = result.padoruCount
        padorupedia = result.padorupedia
      } else {
        await new profileSchema({
          userId,
          padoruCoins,
          padorupedia
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

module.exports.update = async () => {
  return await mongo().then(async mongoose => {
    try {
      const result = await profileSchema.find()
      console.log(result)
      console.log('----------')
      console.log(result[0])

      /*
      result.update({
        $
      })
      */
     
      return
      
    } finally {
      mongoose.connection.close()
    }
  })
}