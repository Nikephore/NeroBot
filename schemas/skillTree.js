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
	dailycoins: {
		level: {
      type: Number,
      default: 1
    },
		dc: {
			type: Number,
			default: 500
		}
	},
  attack: {
    level: {
      type: Number,
      default: 1
    },
		value: {
			type: Number,
			default: 0.5
		}
  },
	sybarite: {
    level: {
      type: Number,
      default: 1
    },
    syba: {
      type: Boolean,
      default: false
    }
  },
  favpadoru: {
    unlocked: {
      type: Boolean,
      default: false
    },
    padoru: {
      type: Number,
      default: 1
    }
  }
})

module.exports = mongoose.model('skillTree', skillTreeSchema)