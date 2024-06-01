import mongoose from 'mongoose'
import express from 'express'
import cors from 'cors'
import userRoutes from './Routes/User.js'
import businessRoutes from './Routes/Business.js'
import productRoutes from './Routes/Products.js'
import salesRoutes from './Routes/Sales.js'

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))

mongoose
  .connect(
    `mongodb+srv://admin:admin@userorderproduct.8vfz73x.mongodb.net/?retryWrites=true&w=majority&appName=UserOrderProduct`
  )
  .then(() => {
    console.log('conectado en el database')
  })
  .then(() => {
    app.listen(3000, () => {
      console.log('conectado en el puerto 3000')
    })
  })
  .catch(err => {
    console.log(err)
  })

app.use('/user', userRoutes)
app.use('/business', businessRoutes)
app.use('/product', productRoutes)
app.use('/sales', salesRoutes)
