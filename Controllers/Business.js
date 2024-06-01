import Business from '../Schema/Business.js'

export const getAllBusinesses = async (req, res) => {
  let businesses
  try {
    businesses = await Business.find()
  } catch (err) {
    console.log(err)
  }
  if (!businesses) {
    return res.status(404).json({ message: 'No businesses found' })
  }
  return res.status(200).json(businesses)
}

export const getById = async (req, res) => {
  let business
  try {
    business = await Business.findById(req.params.id)
  } catch (err) {
    console.log(err)
  }
  if (!business) {
    return res.status(404).json({ message: 'Business not found' })
  }
  return res.status(200).json(business)
}

export const addBusiness = async (req, res) => {
  const { businessName, businessOwner } = req.body
  let existingBusiness
  try {
    existingBusiness = await Business.findOne({ businessName })
  } catch (err) {
    console.log(err)
  }
  if (existingBusiness) {
    return res.status(400).json({ message: 'Business already exists' })
  }
  const business = new Business({
    businessName,
    businessOwner,
    userId: [],
    salesId: [],
    productId: []
  })
  try {
    await business.save()
  } catch (err) {
    console.log(err)
  }
  return res.status(201).json({ message: 'Business created' })
}

export const updateBusiness = async (req, res) => {
  const { businessName, businessOwner } = req.body
  let business
  try {
    business = await Business.findById(req.params.id)
  } catch (err) {
    console.log(err)
  }
  if (!business) {
    return res.status(404).json({ message: 'Business not found' })
  }
  business.businessName = businessName
  business.businessOwner = businessOwner
  try {
    await business.save()
  } catch (err) {
    console.log(err)
  }
  return res.status(200).json({ message: 'Business updated' })
}
export const deleteBusiness = async (req, res) => {
  let business
  try {
    business = await Business.findById(req.params.id)
  } catch (err) {
    console.log(err)
  }
  if (!business) {
    return res.status(404).json({ message: 'Business not found' })
  }
  try {
    await business.remove()
  } catch (err) {
    console.log(err)
  }
  return res.status(200).json({ message: 'Business deleted' })
}
