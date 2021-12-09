const mongoose = require('mongoose')
const mongoPath = process.env.mongoSRV

//Iniciamos MongoDB
module.exports = async () => {
  await mongoose.connect(mongoPath,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected To Mongo')
  })
  .catch((err) => {
    console.log(err)
  })
  return mongoose
}