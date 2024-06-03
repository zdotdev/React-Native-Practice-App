import Sales from '../Schema/Sales.js'
import Business from '../Schema/Business.js'
import mongoose from 'mongoose'
import moment from 'moment'

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
    orderItems,
    totalPrice,
    date,
    time
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
  sale.orderItems = orderItems
  sale.totalPrice = totalPrice
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

export const getByDate = async (req, res) => {
  const { date } = req.body
  let sales
  try {
    sales = await Sales.find({ date: date })
  } catch (err) {
    console.log(err)
  }
  if (!sales) {
    return res.status(404).json({ message: 'No sales found' })
  }
  return res.status(200).json(sales)
}
