import mongoose from 'mongoose'
const { Schema } = mongoose

const businessSchema = new Schema({
  userId: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true
    }
  ],
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
    required: true
  }
})

export default mongoose.model('Business', businessSchema)
