import DTI from '../Schema/DTI.js'

export const getAllDTI = async (req, res) => {
  let dti
  try {
    dti = await DTI.find()
  } catch (err) {
    console.log(err)
  }
  if (!dti) {
    return res.status(404).json({ message: 'No dti found' })
  }
  return res.status(200).json(dti)
}

export const getById = async (req, res) => {
  let dti
  try {
    dti = await DTI.findById(req.params.id)
  } catch (err) {
    console.log(err)
  }
  if (!dti) {
    return res.status(404).json({ message: 'dti not found' })
  }
  return res.status(200).json(dti)
}
