import express from 'express'
import userModel from '../models/userModel.js'
import activityModel from '../models/activityModel.js'
import dataModel from '../models/dataModel.js'

const router = express.Router()
const sec = 'CE68C8072A0A71863350CFB1BED8349CAD41672E'

const response = {
  success: false,
}

router.post('/add', async (req, res) => {
  if (!req.body.data) {
    return res.json(response)
  }

  const {fingerprint, activities, basicToken} = dataModel.encodeData(req.body.data)

  if (basicToken !== sec || !fingerprint || !activities.length) {
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
