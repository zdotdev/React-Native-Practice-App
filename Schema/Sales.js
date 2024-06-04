import mongoose from 'mongoose'
const { Schema } = mongoose

const salesItemSchema = new Schema(
  {
    productName: {
      type: String,
      required: [true, 'Please provide product name']
    },
    quantity: {
      type: String,
      required: [true, 'Please provide quantity']
    },
    pricePerUnit: {
      type: String,
      required: [true, 'Please provide price per unit']
    }
  },
  { _id: false }
)

const salesSchema = new Schema({
  date: {
    type: String,
    required: [true, 'Please provide date']
  },
  time: {
    type: String,
    required: [true, 'Please provide time']
  },
  orderItems: [salesItemSchema],
  totalPrice: {
    type: String,
    required: [true, 'Please provide total price']
  }
})

export default mongoose.model('Sales', salesSchema)
