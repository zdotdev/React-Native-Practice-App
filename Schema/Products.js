import mongoose from 'mongoose'
const { Schema } = mongoose

const productSchema = new Schema({
  productName: {
    type: String,
    required: [true, 'Please provide product name']
  },
  productPrice: {
    type: Number,
    required: [true, 'Please provide product price']
  }
})

export default mongoose.model('Products', productSchema)
