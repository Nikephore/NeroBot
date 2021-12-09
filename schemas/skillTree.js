const mongoose = require('mongoose')


const skillTreeSchema = mongoose.Schema({
  userId: { 
    type: String,
    required: true 
  },
  username: {
    type: String
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
	sybarite: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('skillTree', skillTreeSchema)