const mongo = require('../mongo')
const profileSchema = require('../schemas/profile')

module.exports.addCoins = async (userId, padoruCoins, username) => {
	return await mongo().then(async mongoose => {
    try {
    
      await profileSchema.findOneAndUpdate(
        {	userId },
        {
          userId,
          username,
          $inc: {	padoruCoins },
        },
        {	upsert: true,
          new: true })
    
    } finally {
      mongoose.connection.close()
    }
    
    return padoruCoins
  })
}
    
module.exports.getCoins = async (userId, username) => {
  return await mongo().then(async mongoose => {
    try {
    
      const result = await profileSchema.findOneAndUpdate(
        { userId },
        { username },
        { upsert: true,
          new: true })
    
        return result.padoruCoins
          
    } finally {
      mongoose.connection.close()
    }
  })
}
    
module.exports.newPadoru = async (userId, padorupedia, username) => {
  return await mongo().then(async mongoose => {
    try {
          
      const result = await profileSchema.findOneAndUpdate(
        {	userId },
        {
          username,
          $push: { padorupedia }
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
    
module.exports.myPadorus = async (userId, username) => {
  return await mongo().then(async mongoose => {
    try {
    
      const result = await profileSchema.findOneAndUpdate(
        {	userId },
        {	username },
        { upsert: true,
          new: true })
    
      return result.padorupedia
          
    } finally {
      mongoose.connection.close()
    }
  })
}

module.exports.addAll = async (userId, pp, coin) => {
  return await mongo().then(async mongoose => {
    try {
          
      const result = await profileSchema.findOneAndUpdate(
        {	userId },
        {
          $push: { padorupedia: pp },
          $inc: { padoruCoins: coin}
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