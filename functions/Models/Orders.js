const mongoose = require('mongoose')
const orderSchema = require('../Schema/Orders.js')

const orderModel = mongoose.model('Order', orderSchema)

module.exports = orderModel
