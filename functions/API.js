const express = require('express')
const serverless = require('serverless-http')
const userRoute = require('./Routes/User.js')
const productRoute = require('./Routes/Products.js')
const orderRoute = require('./Routes/Orders.js')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
const db = `mongodb+srv://admin:admin@userorderproduct.8vfz73x.mongodb.net/?retryWrites=true&w=majority&appName=UserOrderProduct`
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose
  .connect(db)
  .then(() => {
    console.log('conectado')
  })
  .catch(err => console.log(err))
app.listen(3000, () => {
  console.log('conectado en el puerto 3000')
})
app.use('/user', userRoute)
app.use('/products', productRoute)
app.use('/orders', orderRoute)
module.exports.handler = serverless(app)
