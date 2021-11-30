const mongoose = require('mongoose')

const languageSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  username: {
    type: String,
    default: 'english'
  }
})

module.exports = mongoose.model('language', languageSchema)