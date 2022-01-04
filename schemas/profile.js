const mongoose = require('mongoose')

const profileSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  username: {
    type: String
  },
  favpadoru: {
    type: String,
    default: "https://cdn.discordapp.com/attachments/901798915425321000/901799120740704276/PADORUorg.png"
  },
  padoruCoins: {
    type: Number,
    default: 0
  },
  daily: {
    type: Number,
    default: 1
  },
  padorupedia: {
    type: Array,
    default: []
  },
  pp: {
    type:[
      {
        id: {
          type: Number
        },
        rarity: {
          type: Number,
          default: 0
        }
      },
    ],
    default: []
  }
})

module.exports = mongoose.model('profile', profileSchema)