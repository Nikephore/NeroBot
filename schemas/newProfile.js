const mongoose = require('mongoose')

const newProfileSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  padoruCoins: {
    type: Number,
    required: true
  },
	rolls: {
		type: Number,
		required: true
	},
	numPadoru: {
    type: Number,
    required: true,
  },
  padorupedia: {
    type: Array,
    required: true,
  },
  achievements: {
		type: Array,
		required: true
	},
	numAchievements: {
		type: Number,
		required: true
	},
  skilltree: {
    type: Object,
    required: true,
  }
})

module.exports = mongoose.model('newProfile', newProfileSchema)