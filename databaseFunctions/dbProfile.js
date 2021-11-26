const mongo = require('../mongo')
const profileSchema = require('../schemas/profile.js')

/* Constante para crear una entrada en la BD si esta
   no existe previamente */
const newentry = {upsert: true, new: true}

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
        {	newentry })
    
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
        { newentry })
    
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
        {	newentry })
    
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
        { newentry })
    
      return padorupedia
          
    } finally {
      mongoose.connection.close()
    }
  })
}