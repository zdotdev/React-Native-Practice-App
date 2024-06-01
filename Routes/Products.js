import express from 'express'
import {
  getAllProducts,
  getById,
  addProduct,
  updateProduct,
  deleteProduct
} from '../Controllers/Products.js'

const router = express.Router()

router.get('/', getAllProducts)
router.get('/:id', getById)
router.post('/', addProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

export default router
