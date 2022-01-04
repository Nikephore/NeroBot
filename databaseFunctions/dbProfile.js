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
    
module.exports.newPadoru = async (userId, pid) => {
  try {      
    const result = await profileSchema.findOneAndUpdate(
      {	userId },
      {
        $push: { pp: {id: pid, rarity: 0}}
      },
      {	
        upsert: true,
        new: true 
      })

  } catch (err) {
    console.log(err)
  }
}

module.exports.upgradePadoru = async (userId, pid) => {
  try {      
    await profileSchema.findOneAndUpdate(
      {	userId, "pp.id": pid },
      {
        $set: {"pp.$.rarity": 1}
      },
      {	
        upsert: true,
        new: true 
      })

  } catch (err) {
    console.log(err)
  }
}
    
module.exports.myPadorus = async (userId, username) => {
  try {

    const result = await profileSchema.findOneAndUpdate(
      {userId},
      {username},
      {	
        fields: {pp: 1, _id: 0},
        upsert: true,
        new: true 
      })

    return result
          
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

module.exports.dumppp = async () => {
	try {
		await profileSchema.updateMany(
      {},
      [{
        $addFields:
        {
          "pp":
            {$map:
              {
                input: "$padorupedia",
                as: "pad",
                in: { 
                  "id": "$$pad",
                  "rarity": 0
                }
              }
            }
        }
      }],
      {multi : true})

	} catch (err) {
    console.log(err)
  }
}

module.exports.dumpdc = async () => {
	try {
		await profileSchema.updateMany(
      {},
      [{
        $addFields:
        {
          "favpadoru": "https://cdn.discordapp.com/attachments/901798915425321000/901799120740704276/PADORUorg.png"
        }
      }],
      {multi : true})

	} catch (err) {
    console.log(err)
  }
}

module.exports.reset = async () => {
	try {
		await profileSchema.updateMany(
      {},
      [
        {
          $unset: ["pp"]
        } 
      ],
      {multi : true})

	} catch (err) {
    console.log(err)
  }
}

module.exports.resetDaily = async () => {
	try {
		await profileSchema.updateMany(
      {},
      {
        $set: {daily: 1}
      },
      {multi : true})

	} catch (err) {
    console.log(err)
  }
}

module.exports.claimDaily = async (uid) => {
	try {
		await profileSchema.findOneAndUpdate(
      {userId: uid},
      {
        $set: {daily: 0}
      },
      {multi : true})

	} catch (err) {
    console.log(err)
  }
}

module.exports.getProfile = async (uid) => {
	try {
		result = await profileSchema.find({userId: uid})

    return result[0]

	} catch (err) {
    console.log(err)
  }
}

module.exports.setFavPadoru = async (uid, tn) => {
	try {
		await profileSchema.findOneAndUpdate(
      {userId: uid},
      {
        $set: {favpadoru: tn}
      },
      {upsert: true,
        new: true})

	} catch (err) {
    console.log(err)
  }
}

