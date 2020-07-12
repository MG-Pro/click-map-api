import express from 'express'
import userModel from '../models/userModel.js'

const router = express.Router()

router.post('/add', async (req, res) => {
  const {fingerprint} = req.body
  
  if (!fingerprint) {
    return res.json(null)
  }
 
  if (await userModel.isExist(fingerprint)) {
    userModel.add(fingerprint)
  }
  
  res.json(null)
})

export default router
