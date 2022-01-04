const mongoose = require('mongoose')

const padoruSchema = mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    unique: true
  },
  active: {
    type: Boolean,
    default: true
  },
  released: {
    type: Boolean,
    default: true
  },
  banner: {
    type: Boolean,
    default: false
  },
  rarity: {
    type: Number
  },
  raritystar: {
    type: String
  },
  series: {
    type: [
      String
    ],
    default: []
  },
  description: {
    type: String
  },
  color: {
    type: String
  },
  artist: {
    type: String
  },
  emoji: {
    type: String
  },
  image: {
    type: String
  },
  owner: {
    userId: {
      type: String,
      default: "442790194555650048"
    },
    username: {
      type: String,
      default: "Nero"
    }
  },
  life: {
    type: Number,
    default: 1
  }
})

module.exports = mongoose.model('padoru', padoruSchema)