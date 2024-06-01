import mongoose from 'mongoose'
const { Schema } = mongoose

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide full name']
  },
  email: {
    type: String,
    required: [true, 'Please provide email']
  },
  username: {
    type: String,
    required: [true, 'Please provide username'],
    unique: [true, 'Username already exists']
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  role: {
    type: String,
    required: [true, 'Please provide role']
  },
  status: {
    type: Boolean,
    required: true,
    default: false
  },
  businessId: {
    type: Schema.Types.ObjectId,
    ref: 'Business',
    required: false,
    default: null
  }
})
export default mongoose.model('User', userSchema)
