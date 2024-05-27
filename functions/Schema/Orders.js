const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderItemSchema = new Schema(
  {
    productId: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    pricePerUnit: {
      type: Number,
      required: true
    },
    orderCount: {
      type: Number,
      required: true
    }
  },
  { _id: false }
)

const orderSchema = new Schema({
  orderDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  orderItems: [orderItemSchema],
  orderPrice: {
    type: Number,
    required: true
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

module.exports = orderSchema
