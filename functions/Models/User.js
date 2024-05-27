const mongoose = require('mongoose')
const userSchema = require('../Schema/User.js')

const userModel = mongoose.model('User', userSchema)

module.exports = userModel
