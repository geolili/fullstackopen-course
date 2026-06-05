require('dotenv').config()
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

mongoose.connect(url, { family: 4 })
  .then(() => console.log('connected to MongoDB'))
  .catch(err => console.log('error connecting to MongoDB:', err.message))

module.exports = {
  MONGODB_URI: url,
  PORT: process.env.PORT
}
