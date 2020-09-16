import express from 'express'
import asyncHandler from 'express-async-handler'
import userModel from '../models/userModel.js'
import activityModel from '../models/activityModel.js'
import dataModel from '../models/dataModel.js'
import elementsModel from '../models/elementsModel.js'

const router = express.Router()
const sec = 'CE68C8072A0A71863350CFB1BED8349CAD41672E'

router.post('/add', asyncHandler(async (req, res) => {
  if (!req.body.data) {
    throw new Error('There isn`t data field in request')
  }

  const {fingerprint, activities, basicToken} = dataModel.encodeData(req.body.data)

  if (basicToken !== sec) {
    throw new Error('Basic token not valid')
  }

  if (!fingerprint) {
    throw new Error('There isn`t fingerprint field in request')
  }

  if (!activities.length) {
    throw new Error('There isn`t any activities in request')
  }

  let user = await userModel.getByFingerprint(fingerprint)

  if (!user) {
    const userId = await userModel.add(fingerprint)
    user = {id: userId}
  }

  const result = !!await activityModel.add(user.id, activities)

  if (result) {
    res.json({success: true})
  } else {
    throw new Error('Activities was not save')
  }
}))

router.get('/by-user-id', asyncHandler(async (req, res) => {
  const userId = req.query.id

  if (!userId) {
    throw new Error('User ID not transmitted')
  }

  const list = await activityModel.getByUserId(userId)

  res.json({
    success: true,
    data: list,
  })
}))

router.get('/auto-clean', asyncHandler(async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.json({
      success: false,
      data: 'Only local method',
    })
  }

  const deletedActivityCount = await activityModel.autoRemove()
  const deletedElementsCount = await elementsModel.autoRemove()

  res.json({
    success: true,
    data: `Deleted ${deletedActivityCount} activity(s), ${deletedElementsCount} element(s)`,
  })
}))

router.get('/all-by-uri', asyncHandler(async (req, res) => {
  const {uri} = req.query

  if (!uri) {
    throw new Error('Uri not transmitted')
  }

  const list = await elementsModel.getAllByUri(uri)

  res.json({
    success: true,
    data: list,
  })
}))

export default router
