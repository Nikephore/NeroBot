
const skillTreeSchema = require('../schemas/skillTree')

module.exports.prollsLvUp = async (userId, username) => {
	try {
		await skillTreeSchema.findOneAndUpdate(
			{ userId },
			{
        username,
				$inc: {
          "prolls.level" : 1,
          "prolls.numrolls": 1
        },
			},
			{ upsert: true,
        new: true })
	} catch (err) {
    console.log(err)
  }
}

module.exports.prollsMinusOne = async (userId, username) => {
	try {
		await skillTreeSchema.findOneAndUpdate(
			{ userId },
			{
        username,
				$inc: {"prolls.numrolls" : -1}
			},
			{ upsert: true,
        new: true })
	} catch (err) {
    console.log(err)
  }
}



module.exports.probluckyLvUp = async (userId, username) => {
	try {
		await skillTreeSchema.findOneAndUpdate(
			{ userId },
			{
        username,
				$inc: {
          "problucky.level" : 1,
          "problucky.prob" : -3
        },
			},
			{ upsert: true,
        new: true })
	} catch (err) {
    console.log(err)
  }
}

module.exports.dailycoinsLvUp = async (userId, username) => {
	try {
		await skillTreeSchema.findOneAndUpdate(
			{ userId },
			{
        username,
				$inc: {
          "dailycoins.level" : 1,
          "dailycoins.dc" : 1500
        },
				},
			{ upsert: true,
        new: true })
	} catch (err) {
    console.log(err)
  }
}

module.exports.sybariteUnlock = async (userId, username) => {
	try {
    console.log('IN')
		await skillTreeSchema.findOneAndUpdate(
			{ userId },
			{	username,
        $inc: {"sybarite.level" : 1},
        $set: {"sybarite.syba" : true}
      },
			{ upsert: true,
        new: true })
	} catch (err) {
    console.log(err)
  }
}

module.exports.getSkillTree = async (userId, username) => {
	try {
		const result = await skillTreeSchema.findOneAndUpdate(
      { userId },
      { username },
      { upsert: true,
        new: true })
    
    return result
			
	} catch (err) {
    console.log(err)
  }
}

module.exports.resetRolls = async () => {
	try {
		await skillTreeSchema.updateMany(
      {},
      [{$set:{ 
        "prolls.numrolls" : "$prolls.level"}}],
      {multi : true})

	} catch (err) {
    console.log(err)
  }
}