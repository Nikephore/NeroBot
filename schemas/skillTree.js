const mongoose = require('mongoose')


const skillTreeSchema = mongoose.Schema({
  userId: { 
    type: String,
    required: true 
  },
  username: {
    type: String
  },
	cooldown: {
		level: {
      type: Number,
      default: 1
    },
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
		level: {
      type: Number,
      default: 1
    },
		numrolls: {
      type: Number,
      default: 1
    }
	},
	problucky: {
		level: {
      type: Number,
      default: 1
    },
		prob: {
			type: Number,
			default: 25
		}
	},
	dailyCoins: {
		level: {
      type: Number,
      default: 1
    },
		dc: {
			type: Number,
			default: 500
		}
	},
	favpadoru: {
    type: Boolean,
    default: false
  },
	sybarite: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('skillTree', skillTreeSchema)