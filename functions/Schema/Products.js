const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
  productName: {
    type: String,
    required: [true, 'Product Name is required'],
    unique: true
  },
  productPrice: {
    type: Number,
    required: [true, 'Product Price is required']
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

module.exports = productSchema
