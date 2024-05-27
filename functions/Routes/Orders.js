const express = require('express')
const router = express.Router()
const orderModel = require('../Models/Orders.js')
const userModel = require('../Models/User.js')
const mongoose = require('mongoose')

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
router.get('/', async (req, res) => {
  try {
    const order = await orderModel.find()
    res.status(200).json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
router.get('/:id', getOrder, async (req, res) => {
  try {
    res.status(200).json(res.order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
router.post('/addOrder', async (req, res) => {
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

router.put('/:id', getOrder, async (req, res) => {
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
router.delete('/:id', getOrder, async (req, res) => {
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
router.get('/user/:id', async (req, res) => {
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
module.exports = router
