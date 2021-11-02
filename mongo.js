const mongoose = require('mongoose')
const mongoPath = process.env.mongoSRV

module.exports = async () => {
  await mongoose.connect(mongoPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(console.log('Connected To Mongo'))
  return mongoose
}