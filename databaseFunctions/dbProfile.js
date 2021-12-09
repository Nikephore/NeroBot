const profileSchema = require('../schemas/profile')

module.exports.addCoins = async (userId, padoruCoins, username) => {
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
    
  } catch (err) {
    console.log(err)
  }
    
  return padoruCoins
}
    
module.exports.getCoins = async (userId, username) => {
  try {
    const result = await profileSchema.findOneAndUpdate(
      { userId },
      { username },
      { upsert: true,
        new: true })
    
      return result.padoruCoins
          
  } catch (err) {
    console.log(err)
  }
}
    
module.exports.newPadoru = async (userId, padorupedia, username) => {
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

  } catch (err) {
    console.log(err)
  }
}
    
module.exports.myPadorus = async (userId, username) => {
  try {
    const result = await profileSchema.findOneAndUpdate(
      {	userId },
      {	username },
      { upsert: true,
        new: true })
    
    return result.padorupedia
          
  } catch (err) {
    console.log(err)
  }
}

module.exports.addAll = async (userId, pp, coin) => {
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
  } catch (err) {
    console.log(err)
  }
}

module.exports.getProfile = async (userId, username) => {
	try {

		const result = await profileSchema.findOneAndUpdate(
      { userId },
      { username },
      { upsert: true,
        new: true })

    return result
		
	} catch (err) {
    console.log(err)
  }
}