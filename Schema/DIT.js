import mongoose from 'mongoose'
const { Schema } = mongoose

const DITSchema = new Schema({
  businessOwner: {
    type: String,
    required: [true, 'Please provide business owner']
  },
  businessName: {
    type: String,
    required: [true, 'Please provide business name']
  },
  salesData: {
    type: Array,
    required: [true, 'Please provide sales data']
  }
})

export default mongoose.model('DIT', DITSchema)
