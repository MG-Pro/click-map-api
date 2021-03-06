import express from 'express'
import asyncHandler from 'express-async-handler'
import userModel from '../models/userModel.js'
import transitionModel from '../models/transitionModel.js'
import dataModel from '../models/dataModel.js'

const router = express.Router()
const sec = 'CE68C8072A0A71863350CFB1BED8349CAD41672E'

router.post('/add', asyncHandler(async (req, res) => {
  if (!req.body) {
    throw new Error('There isn`t data field in request')
  }

  const encodedData = dataModel.decodeData(req.body)

  const {visitorId, transitions, token, dev} = dataModel.createDataObject(encodedData)

  if (token !== sec) {
    throw new Error('Basic token not valid')
  }

  if (!visitorId) {
    throw new Error('There isn`t visitorId field in request')
  }

  if (!transitions.length) {
    throw new Error('There isn`t any transitions in request')
  }

  let visitor = await userModel.getByVisitorId(visitorId)

  if (!visitor) {
    const userId = await userModel.add(visitorId)
    visitor = {id: userId}
  }

  const result = !!await transitionModel.add(visitor.id, transitions, req.ip, dev)

  if (result) {
    res.json({success: true})
  } else {
    throw new Error('Transitions was not save')
  }
}))

router.get('/by-user-id', asyncHandler(async (req, res) => {
  const userId = req.query.id

  if (!userId) {
    throw new Error('User ID not transmitted')
  }

  const list = await transitionModel.getByUserId(userId)

  res.json({
    success: true,
    data: list,
  })
}))

export default router
