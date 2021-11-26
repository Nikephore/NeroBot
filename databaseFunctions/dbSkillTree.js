const mongo = require('../mongo')
const skillTreeSchema = require('../schemas/skillTree')

/* Constante para crear una entrada en la BD si esta
   no existe previamente */
const newentry = {upsert: true, new: true}

/* Funcion que gestiona la subida de nivel del cooldown */
module.exports.cooldownLvUp = async (userId) => {
  return await mongo().then(async mongoose => {
    try {
      await skillTreeSchema.findOneAndUpdate(
			{ userId },
      {
        $inc: {"cooldown.level" : 1},
        $inc: {"cooldown.time" : -1}
      },
      { newentry })
        
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
				{ newentry })

		} finally {
			mongoose.connection.close()
		}
	})
}

module.exports.prollsLvUp = async (userId) => {
	return await mongo().then(async mongoose => { 
		try {
			await skillTreeSchema.findOneAndUpdate(
				{ userId },
				{
					$inc: {"prolls.level" : 1},
					$inc: {"prolls.numrolls" : 1}
				},
				{ newentry })
		} finally {
			mongoose.connection.close()
		}
	})
}

module.exports.probluckyLvUp = async (userId) => {
	return await mongo().then(async mongoose => { 
		try {
			await skillTreeSchema.findOneAndUpdate(
				{ userId },
				{
					$inc: {"problucky.level" : 1},
					$inc: {"problucky.prob" : -3}
				},
				{ newentry })
		} finally {
			mongoose.connection.close()
		}
	})
}

module.exports.dailycoinsLvUp = async (userId) => {
	return await mongo().then(async mongoose => { 
		try {
			await skillTreeSchema.findOneAndUpdate(
				{ userId },
				{
					$inc: {"dailycoins.level" : 1},
					$inc: {"dailicoins.dc" : 500}
				},
				{ newentry })
		} finally {
			mongoose.connection.close()
		}
	})
}

module.exports.favpadoruUnlock = async (userId) => {
	return await mongo().then(async mongoose => { 
		try {
			await skillTreeSchema.findOneAndUpdate(
				{ userId },
				{	$set: {favpadoru : true} },
				{ newentry })
		} finally {
			mongoose.connection.close()
		}
	})
}

module.exports.sybariteUnlock = async (userId) => {
	return await mongo().then(async mongoose => { 
		try {
			await skillTreeSchema.findOneAndUpdate(
				{ userId },
				{	$set: {sybarite : true} },
				{ newentry })
		} finally {
			mongoose.connection.close()
		}
	})
}