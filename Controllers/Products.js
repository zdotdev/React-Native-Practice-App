import Products from '../Schema/Products.js'
import Business from '../Schema/Business.js'
import mongoose from 'mongoose'
import CryptoJS from 'crypto-js'
import dotenv from 'dotenv'
dotenv.config()

const key = process.env.KEY

function e (text, secretKey) {
  const ciphertext = CryptoJS.AES.encrypt(text, secretKey).toString()
  return ciphertext
}

export const getAllProducts = async (req, res) => {
  let products
  try {
    products = await Products.find()
  } catch (err) {
    console.log(err)
  }
  if (!products) {
    return res.status(404).json({ message: 'No products found' })
  }
  return res.status(200).json(products)
}

export const getById = async (req, res) => {
  let product
  try {
    product = await Products.findById(req.params.id)
  } catch (err) {
    console.log(err)
  }
  if (!product) {
    return res.status(404).json({ message: 'Product not found' })
  }
  return res.status(200).json(product)
}

export const addProduct = async (req, res) => {
  const { productName, productPrice, businessName } = req.body
  let existingProduct
  let existingBusiness
  try {
    existingProduct = await Products.findOne({ productName })
    existingBusiness = await Business.findOne({ businessName })
  } catch (err) {
    console.log(err)
  }
  if (existingProduct) {
    return res.status(400).json({ message: 'Product already exists' })
  }
  if (!existingBusiness) {
    return res.status(404).json({ message: 'Business not found' })
  }
  const product = new Products({
    productName: e(productName, key),
    productPrice: e(productPrice.toString(), key)
  })
  try {
    const session = await mongoose.startSession()
    session.startTransaction()
    await product.save({ session })
    existingBusiness.productId.push(product)
    await existingBusiness.save({ session })
    await session.commitTransaction()
  } catch (err) {
    console.log(err)
  }
  return res.status(201).json({ message: 'Product created' })
}

export const updateProduct = async (req, res) => {
  const { productName, productPrice } = req.body
  let product
  try {
    product = await Products.findById(req.params.id)
  } catch (err) {
    console.log(err)
  }
  if (!product) {
    return res.status(404).json({ message: 'Product not found' })
  }
  product.productName = e(productName, key)
  product.productPrice = e(productPrice.toString(), key)
  try {
    await product.save()
  } catch (err) {
    console.log(err)
  }
  return res.status(200).json({ message: 'Product updated' })
}

export const deleteProduct = async (req, res) => {
  const businessName = req.body.businessName
  let product
  try {
    product = await Products.findById(req.params.id)
  } catch (err) {
    console.log(err)
  }
  if (!product) {
    return res.status(404).json({ message: 'Product not found' })
  }
  if (!businessName) {
    return res.status(404).json({ message: 'Please provide business name' })
  }
  try {
    await Business.updateOne(
      { businessName },
      { $pull: { productId: req.params.id } }
    )
    await Products.deleteOne({ _id: req.params.id })
  } catch (err) {
    console.log(err)
  }
  return res.status(200).json({ message: 'Product deleted' })
}
