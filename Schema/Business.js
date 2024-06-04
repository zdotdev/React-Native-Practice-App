import mongoose from 'mongoose'
const { Schema } = mongoose

const businessSchema = new Schema({
  salesId: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Sales',
      required: true
    }
  ],
  productId: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Products',
      required: true
    }
  ],
  businessName: {
    type: String,
    required: [true, 'Please provide business name'],
    unique: true
  },
  businessOwner: {
    type: String,
    required: [true, 'Please provide business owner']
  },
  occupant: {
    type: String,
    required: true
  },
  spaceNumber: {
    type: String,
    required: false,
    unique: true,
    default: null
  }
})

export default mongoose.model('Business', businessSchema)
