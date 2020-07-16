import express from 'express'
import userModel from '../models/userModel.js'
import activityModel from '../models/activityModel.js'

const router = express.Router()

router.post('/add', async (req, res) => {
  const response = {
    success: false,
  }

  const {fingerprint, activities} = req.body

  if (!fingerprint || !activities.length) {
    return res.json(response)
  }

  let user = await userModel.getByFingerprint(fingerprint)

  if (!user) {
    user = await userModel.add(fingerprint)
  }

  response.success = !!await activityModel.add(user.id, activities)
  res.json(response)
})

export default router
