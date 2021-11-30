const mongo = require('../mongo')
const skillTreeSchema = require('../schemas/skillTree')

/* Funcion que gestiona la subida de nivel del cooldown */
module.exports.cooldownLvUp = async (userId, username) => {
  return await mongo().then(async mongoose => {
    try {
      await skillTreeSchema.findOneAndUpdate(
			{ userId },
      {
        username,
        $inc: {"cooldown.level" : 1},
        $inc: {"cooldown.time" : -1}
      },
      { upsert: true,
          new: true })
        
    } finally {
      mongoose.connection.close()
    }
  })
}

module.exports.cooldownHourly = async (userIds) => {
	return await mongo().then(async mongoose => {
		try {
			await skillTreeSchema.updateMany(
				{userId : { $in: userIds }},
				{"cooldown.timeleft" : 
				{ $cond: {
					if: {
						$eq: ["cooldown.timeleft", 1]
					},
					then: "cooldown.time",
					else: {
						$inc: {"cooldown.timeleft" : -1}}
					}
					}
				},
				{ upsert: true,
          		  new: true })

		} finally {
			mongoose.connection.close()
		}
	})
}

module.exports.prollsLvUp = async (userId, username) => {
	return await mongo().then(async mongoose => { 
		try {
			await skillTreeSchema.findOneAndUpdate(
				{ userId },
				{
          username,
					$inc: {"prolls.level" : 1},
					$inc: {"prolls.numrolls" : 1}
				},
				{ upsert: true,
          new: true })
		} finally {
			mongoose.connection.close()
		}
	})
}

module.exports.probluckyLvUp = async (userId, username) => {
	return await mongo().then(async mongoose => { 
		try {
			await skillTreeSchema.findOneAndUpdate(
				{ userId },
				{
          username,
					$inc: {"problucky.level" : 1},
					$inc: {"problucky.prob" : -3}
				},
				{ upsert: true,
          new: true })
		} finally {
			mongoose.connection.close()
		}
	})
}

module.exports.dailycoinsLvUp = async (userId, username) => {
	return await mongo().then(async mongoose => { 
		try {
			await skillTreeSchema.findOneAndUpdate(
				{ userId },
				{
          username,
					$inc: {"dailycoins.level" : 1},
					$inc: {"dailicoins.dc" : 500}
				},
				{ upsert: true,
          new: true })
		} finally {
			mongoose.connection.close()
		}
	})
}

module.exports.favpadoruUnlock = async (userId, username) => {
	return await mongo().then(async mongoose => { 
		try {
			await skillTreeSchema.findOneAndUpdate(
				{ userId },
				{	username,
          $set: {favpadoru : true} },
				{ upsert: true,
          new: true })
		} finally {
			mongoose.connection.close()
		}
	})
}

module.exports.sybariteUnlock = async (userId, username) => {
	return await mongo().then(async mongoose => { 
		try {
			await skillTreeSchema.findOneAndUpdate(
				{ userId },
				{	username,
          $set: {sybarite : true} },
				{ upsert: true,
          new: true })
		} finally {
			mongoose.connection.close()
		}
	})
}

module.exports.getSkillTree = async (userId, username) => {
	return await mongo().then(async mongoose => {
		try {

      console.log(userId)
      console.log(username)
			const result = await skillTreeSchema.findOneAndUpdate(
        { userId },
        { username },
        { upsert: true,
          new: true })
    
      return result
			
		} finally {
			mongoose.connection.close()
		}
	})
}