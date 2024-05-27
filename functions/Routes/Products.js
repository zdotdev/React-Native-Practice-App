const express = require('express')
const router = express.Router()
const productModel = require('../Models/Products.js')
const userModel = require('../Models/User.js')
const mongoose = require('mongoose')

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
