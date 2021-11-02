const mongoose = require('mongoose')

const profileSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  padoruCoins: {
    type: Number,
    required: true
  },
  padorupedia: {
    type: Array,
    required: true,
    uniqueItems: false
  }
})

module.exports = mongoose.model('profile', profileSchema)