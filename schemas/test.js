const mongoose = require('mongoose')

const testSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  padorupedia: {
    type: Array,
    required: true,
  }
})

module.exports = mongoose.model('test', testSchema)