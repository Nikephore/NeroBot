const mongoose = require('mongoose')

const newProfileSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    default: 'placeholder'
  },
  padoruCoins: {
    type: Number,
    required: true,
    default: 0
  },
	rolls: {
		padoruRolls: {
      type: Number,
      default: 0
    },
		rouletteRolls: {
      type: Number,
      default: 0
    }  
	},
  tickets: {
    type: Number,
    default: 0
  },
	numPadoru: {
    type: Number,
    required: true,
    default: 0
  },
  padorupedia: {
    type: Array,
    required: true,
  },
})

module.exports = mongoose.model('newProfile', newProfileSchema)