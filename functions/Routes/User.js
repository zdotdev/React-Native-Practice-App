const express = require('express')
const userModel = require('../Models/User.js')
const router = express.Router()
const bcrypt = require('bcryptjs')

async function getAllUsers (req, res, next) {
  try {
    const user = await userModel.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.user = user
    next()
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

router.get('/', async (req, res) => {
  try {
    const user = await userModel.find()
    res.status(200).json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
router.post('/signup', async (req, res) => {
  const { name, email, password, businessName } = req.body
  let existingUser

  try {
    existingUser = await userModel.findOne({ businessName })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' })
  }

  const hashedPassword = bcrypt.hashSync(password)

  const user = new userModel({
    name,
    email,
    password: hashedPassword,
    businessName,
    orders: [],
    products: []
  })
  try {
    await user.save()
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
  return res.status(201).json({ user })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  let existingUser

  try {
    existingUser = await userModel.findOne({ email })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
  if (!existingUser) {
    return res.status(404).json({ message: 'User not found' })
  }
  const passwordIsCorrect = bcrypt.compareSync(password, existingUser.password)

  if (!passwordIsCorrect) {
    return res.status(401).json({ message: 'Incorrect Password' })
  }
  return res.status(200).json({ message: 'Login Successful' })
})

router.delete('/:id', getAllUsers, async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'User deleted' })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

module.exports = router
