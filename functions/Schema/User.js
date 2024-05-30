const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required']
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  businessName: {
    type: String,
    required: [true, 'Business Name is required']
  },
  sales: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Orders',
      required: true
    }
  ],
  products: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Products',
      required: true
    }
  ]
})

module.exports = userSchema
