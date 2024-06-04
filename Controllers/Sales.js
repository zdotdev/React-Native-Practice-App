import Sales from '../Schema/Sales.js'
import Business from '../Schema/Business.js'
import mongoose from 'mongoose'
import moment from 'moment'
import CryptoJS from 'crypto-js'
import dotenv from 'dotenv'
dotenv.config()

const key = process.env.KEY

function e (text, secretKey) {
  const ciphertext = CryptoJS.AES.encrypt(text, secretKey).toString()
  return ciphertext
}

export const getAllSales = async (req, res) => {
  let sales
  try {
    sales = await Sales.find()
  } catch (err) {
    console.log(err)
  }
  if (!sales) {
    return res.status(404).json({ message: 'No sales found' })
  }
  return res.status(200).json(sales)
}

export const getById = async (req, res) => {
  let sale
  try {
    sale = await Sales.findById(req.params.id)
  } catch (err) {
    console.log(err)
  }
  if (!sale) {
    return res.status(404).json({ message: 'Sale not found' })
  }
  return res.status(200).json(sale)
}

export const addSale = async (req, res) => {
  const { orderItems, totalPrice, businessName } = req.body
  let existingBusiness
  const time = moment().format('HHmm')
  const date = moment().format('YYYYDDMM')

  try {
    existingBusiness = await Business.findOne({ businessName })
  } catch (err) {
    console.log(err)
  }
  if (!existingBusiness) {
    return res.status(404).json({ message: 'Business not found' })
  }
  const sale = new Sales({
    orderItems: orderItems.map(item => ({
      productName: e(item.productName, key),
      quantity: e(item.quantity, key),
      pricePerUnit: e(item.pricePerUnit, key)
    })),
    totalPrice: e(totalPrice, key),
    date: e(date.toString(), key),
    time: e(time.toString(), key)
  })
  try {
    const session = await mongoose.startSession()
    session.startTransaction()
    await sale.save({ session })
    existingBusiness.salesId.push(sale)
    await existingBusiness.save({ session })
    await session.commitTransaction()
  } catch (err) {
    console.log(err)
  }
  return res.status(201).json({ message: 'Sale created' })
}

export const updateSale = async (req, res) => {
  const { orderItems, totalPrice } = req.body
  let sale
  try {
    sale = await Sales.findById(req.params.id)
  } catch (err) {
    console.log(err)
  }
  if (!sale) {
    return res.status(404).json({ message: 'Sale not found' })
  }
  sale.orderItems = orderItems.map(item => ({
    productName: e(item.productName, key),
    quantity: e(item.quantity, key),
    pricePerUnit: e(item.pricePerUnit, key)
  }))
  sale.totalPrice = e(totalPrice, key)
  try {
    await sale.save()
  } catch (err) {
    console.log(err)
  }
  return res.status(200).json({ message: 'Sale updated' })
}

export const deleteSale = async (req, res) => {
  const businessName = req.body.businessName
  let sale
  try {
    sale = await Sales.findById(req.params.id)
  } catch (err) {
    console.log(err)
  }
  if (!sale) {
    return res.status(404).json({ message: 'Sale not found' })
  }
  if (!businessName) {
    return res.status(404).json({ message: 'Business not found' })
  }
  try {
    await Business.updateOne(
      { businessName },
      { $pull: { salesId: req.params.id } }
    )
    await sale.deleteOne({ _id: req.params.id })
  } catch (err) {
    console.log(err)
  }
  return res.status(200).json({ message: 'Sale deleted' })
}
