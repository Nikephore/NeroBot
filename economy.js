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

async function update (userId, count){
  return await mongo().then(async mongoose => {
    try {

      const result = await profileSchema.findOne({userId}, function (err, doc) {
      if (err) return done(err);
      // Create the new field if it doesn't exist yet
      doc.padoruCount || (doc.padoruCount = count)

      doc.save(done);
      })
/*
      const result = await profileSchema.findOneAndUpdate({
          userId
        },
        {
          $set : padoruCount
        },
        {
          upsert: false,
          new: true
        })
*/
      return
      
    } finally {
      mongoose.connection.close()
    }
  })
}

module.exports.updateAll = async () => {
  return await mongo().then(async mongoose => {
    try {
      const result = await profileSchema.find()
      
      //const test = await update(result[0].userId)
      result.forEach(async function(e){
        var up = await update(e.userId, e.padorupedia.length)
      })

      return
      
    } finally {
      mongoose.connection.close()
    }
  })
}



