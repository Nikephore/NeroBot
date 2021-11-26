const mongoose = require('mongoose')

const reqStr = { type: String, required: true }
const lv = { type: Number, default: 1 }
const bool = { type: Boolean, default: false}


const newProfileSchema = mongoose.Schema({
  userId: reqStr,
  username: reqStr,
	cooldown: {
		level: lv,
		time: {
			type: Number,
			default: 6
		},
		timeleft: {
			type: Number,
			default: 6
		}
	},
	prolls: {
		level: lv,
		numrolls: lv
	},
	problucky: {
		level: lv,
		prob: {
			type: Number,
			default: 25
		}
	},
	dailyCoins: {
		level: lv,
		dc: {
			type: Number,
			default: 500
		}
	},
	favpadoru: bool,
	sybarite: bool
})

module.exports = mongoose.model('skillTree', skillTreeSchema)