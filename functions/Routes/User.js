const express = require('express')
const productModel = require('../Models/Products.js')
const orderModel = require('../Models/Orders.js')
const userModel = require('../Models/User.js')
const router = express.Router()
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

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

router.get('/user/', async (req, res) => {
  try {
    const user = await userModel.find()
    res.status(200).json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
router.post('/user/signup', async (req, res) => {
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

router.post('/user/login', async (req, res) => {
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

router.delete('/user/:id', getAllUsers, async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'User deleted' })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

async function getOrder (req, res, next) {
  try {
    const order = await orderModel.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }
    res.order = order
    next()
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}
router.get('/order/', async (req, res) => {
  try {
    const order = await orderModel.find()
    res.status(200).json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
router.get('/order/:id', getOrder, async (req, res) => {
  try {
    res.status(200).json(res.order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
router.post('/order/addOrder', async (req, res) => {
  const { orderItems, orderPrice, user } = req.body
  let existingUser

  try {
    existingUser = await userModel.findById(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
  if (!existingUser) {
    return res.status(404).json({ message: 'User not found' })
  }
  const order = new orderModel({
    orderItems,
    orderPrice,
    user
  })
  try {
    const session = await mongoose.startSession()
    session.startTransaction()
    await order.save({ session: session })
    existingUser.orders.push(order)
    await existingUser.save({ session: session })
    await session.commitTransaction()
    session.endSession()
    res.status(201).json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
  return res.status(201).json({ order })
})

router.put('/order/:id', getOrder, async (req, res) => {
  try {
    let order = await orderModel.findByIdAndUpdate(
      { _id: req.params },
      req.body,
      { new: true }
    )
    res.status(200).json({ message: 'Order updated', order })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
router.delete('/order/:id', getOrder, async (req, res) => {
  try {
    let order = await orderModel
      .findByIdAndDelete(req.params.id)
      .populate('user')
    await order.user.orders.pull(order)
    await order.user.save()
    res.status(200).json({ message: 'Order deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
router.get('/order/user/:id', async (req, res) => {
  try {
    let userOrder = await userModel
      .findById(req.params.id)
      .populate({ path: 'Orders', strictPopulate: false, model: 'Orders' })
    if (!userOrder) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json(userOrder.orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getProduct (req, res, next) {
  try {
    const product = await productModel.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.product = product
    next()
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

router.get('/products/', async (req, res) => {
  try {
    const product = await productModel.find()
    res.status(200).json(product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/products/:id', getProduct, async (req, res) => {
  try {
    res.status(200).json(res.product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/products/addProduct', async (req, res) => {
  const { productName, productPrice, user } = req.body
  let existingUser
  let existingProduct

  try {
    existingUser = await userModel.findById(user)
    existingProduct = await productModel.findOne({ productName })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
  if (!existingUser) {
    return res.status(404).json({ message: 'User not found' })
  }
  if (existingProduct) {
    return res.status(400).json({ message: 'Product already exist' })
  }
  const product = new productModel({
    productName,
    productPrice,
    user
  })
  try {
    const session = await mongoose.startSession()
    session.startTransaction()
    await product.save({ session })
    existingUser.products.push(product)
    await existingUser.save({ session })
    await session.commitTransaction()
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
  return res.status(201).json({ product })
})

router.put('/products/:id', getProduct, async (req, res) => {
  try {
    let product = await productModel.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    )
    res.status(200).json({ message: 'Product Updated', product })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.delete('/products/:id', getProduct, async (req, res) => {
  try {
    let product = await productModel
      .findByIdAndDelete(req.params.id)
      .populate('user')
    await product.user.products.pull(product)
    await product.user.save()
    res.status(200).json({ message: 'Product Deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/products/user/:id', async (req, res) => {
  try {
    let userProducts = await userModel
      .findById(req.params.id)
      .populate({ path: 'Products', strictPopulate: false, model: 'Products' })
    if (!userProducts) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json(userProducts.products)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
