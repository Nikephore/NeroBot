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
})

module.exports = mongoose.model('newProfile', newProfileSchema)