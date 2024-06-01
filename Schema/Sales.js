import mongoose from 'mongoose'
const { Schema } = mongoose

const salesItemSchema = new Schema(
  {
    productName: {
      type: String,
      required: [true, 'Please provide product name']
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    pricePerUnit: {
      type: Number,
      required: [true, 'Please provide price per unit']
    }
  },
  { _id: false }
)

const salesSchema = new Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  orderItems: [salesItemSchema],
  totalPrice: {
    type: Number,
    required: [true, 'Please provide total price']
  }
})

export default mongoose.model('Sales', salesSchema)
