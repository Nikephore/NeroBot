const mongoose = require('mongoose')

const profileSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  username: {
    type: String,
  },
  padoruCoins: {
    type: Number,
    default : 0
  },
  padorupedia: {
    type: Array
  }
})

module.exports = mongoose.model('profile', profileSchema)