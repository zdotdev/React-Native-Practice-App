const mongoose = require('mongoose')
const productSchema = require('../Schema/Products.js')

const productModel = mongoose.model('Product', productSchema)

module.exports = productModel
