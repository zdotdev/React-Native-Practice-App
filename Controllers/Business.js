import Business from '../Schema/Business.js'
import User from '../Schema/User.js'
import mongoose from 'mongoose'
import CryptoJS from 'crypto-js'
import dotenv from 'dotenv'
dotenv.config()

const key = process.env.KEY

function e (text, secretKey) {
  const ciphertext = CryptoJS.AES.encrypt(text, secretKey).toString()
  return ciphertext
}

export const getAllBusinesses = async (req, res) => {
  let businesses
  try {
    businesses = await Business.find()
  } catch (err) {
    console.log(err)
  }
  if (!businesses) {
    return res.status(404).json({ message: 'No businesses found' })
  }
  return res.status(200).json(businesses)
}

export const getById = async (req, res) => {
  let business
  try {
    business = await Business.findById(req.params.id)
  } catch (err) {
    console.log(err)
  }
  if (!business) {
    return res.status(404).json({ message: 'Business not found' })
  }
  return res.status(200).json(business)
}

export const addBusiness = async (req, res) => {
  const { businessName, businessOwner, userId } = req.body
  let existingBusiness
  let existingUser
  try {
    existingBusiness = await Business.findOne({ businessName })
    existingUser = await User.findById(userId)
  } catch (err) {
    console.log(err)
  }
  if (existingBusiness) {
    return res.status(400).json({ message: 'Business already exists' })
  }
  if (!existingUser) {
    return res.status(404).json({ message: 'User not found' })
  }
  const business = new Business({
    businessName: e(businessName, key),
    businessOwner: e(businessOwner, key),
    occupant: e('false', key),
    salesId: [],
    productId: []
  })
  try {
    const session = await mongoose.startSession()
    session.startTransaction()
    await business.save({ session })
    existingUser.businessId = business
    await existingUser.save({ session })
    await session.commitTransaction()
  } catch (err) {
    console.log(err)
  }
  return res.status(201).json({ message: 'Business created' })
}

export const updateBusiness = async (req, res) => {
  const { businessName, businessOwner, occupant, spaceNumber } = req.body
  let business
  try {
    business = await Business.findById(req.params.id)
  } catch (err) {
    console.log(err)
  }
  if (!business) {
    return res.status(404).json({ message: 'Business not found' })
  }
  business.businessName = e(businessName, key)
  business.businessOwner = e(businessOwner, key)
  business.occupant = e(occupant, key)
  business.spaceNumber = e(spaceNumber, key)
  try {
    await business.save()
  } catch (err) {
    console.log(err)
  }
  return res.status(200).json({ message: 'Business updated' })
}
export const deleteBusiness = async (req, res) => {
  let business
  const userId = req.body.userId
  try {
    business = await Business.findById(req.params.id)
  } catch (err) {
    console.log(err)
  }
  if (!business) {
    return res.status(404).json({ message: 'Business not found' })
  }
  if (!userId) {
    return res.status(404).json({ message: 'Please provide user id' })
  }
  try {
    await User.updateOne({ userId }, { $pull: { businessId: req.params.id } })
    await Business.deleteOne({ _id: req.params.id })
  } catch (err) {
    console.log(err)
  }
  return res.status(200).json({ message: 'Business deleted' })
}

export const updateStatus = async (req, res) => {
  const { occupant, spaceNumber } = req.body
  let business

  try {
    business = await Business.findById(req.params.id)
  } catch (err) {
    console.log(err)
  }
  if (!business) {
    return res.status(404).json({ message: 'Business not found' })
  }
  business.occupant = e(occupant, key)
  business.spaceNumber = e(spaceNumber, key)
  try {
    await business.save()
  } catch (err) {
    console.log(err)
  }
  return res.status(200).json({ message: 'Status updated' })
}
