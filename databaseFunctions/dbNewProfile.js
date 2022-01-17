const newProfileSchema = require('../schemas/newProfile')

/* Funciones para gestionar los Tickets */
module.exports.addTicket = async (userId, num) => {
  try {
    await newProfileSchema.findOneAndUpdate(
		{	userId },
    {
      $inc: {tickets : num}
    },
    {	
      upsert: true,
      new: true 
    })
      
  } catch (err) {
    console.log(err)
  }
}

module.exports.addTickets = async (uid, num) => {
  try {

    if(uid === []){
      return
    }
    
    await newProfileSchema.updateMany(
		{	userId: uid },
    {
      $inc: {tickets : num}
    },
    {	
      upsert: true,
      new: true 
    })
      
  } catch (err) {
    console.log(err)
  }
}

module.exports.myTickets = async (userId, username) => {
  try {
    const result = await newProfileSchema.findOneAndUpdate({userId},
    {
      username,
    },
    {	
      upsert: true,
      new: true 
    })

    return result.tickets
      
  } catch (err) {
    console.log(err)
  }
}

module.exports.removeTicket = async (userId, username, number) => {
  try {

    await newProfileSchema.findOneAndUpdate({
      userId
    },
    {
      username,
      $inc: {tickets : -number}
    },
    {	
      upsert: true,
      new: true 
    })
  } catch (err) {
    console.log(err)
  }
}

/* Funciones para gestionar los rolls*/
module.exports.addRoll = async (userId, number) => {
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
      
  } catch (err) {
    console.log(err)
  } 
}

module.exports.myRolls = async (userId, username) => {
  try {
    const result = await newProfileSchema.findOneAndUpdate({userId},
    {
      username,
    },
    {	
      upsert: true,
      new: true 
    })

    return result.rolls.padoruRolls  
  } catch (err) {
    console.log(err)
  }
}

module.exports.getNewProfile = async (userId, username) => {
	try {

    console.log(userId)
    console.log(username)
		const result = await newProfileSchema.findOneAndUpdate(
      { userId },
      { username },
      { upsert: true,
        new: true })
    
    return result
			
	} catch (err) {
    console.log(err)
  }
}