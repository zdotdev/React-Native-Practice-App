import express from 'express'
import {
  getAllBusinesses,
  getById,
  addBusiness,
  updateBusiness,
  deleteBusiness
} from '../Controllers/Business.js'

const router = express.Router()

router.get('/', getAllBusinesses)
router.get('/:id', getById)
router.post('/', addBusiness)
router.put('/:id', updateBusiness)
router.delete('/:id', deleteBusiness)

export default router
