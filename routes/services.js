import express from 'express'
import asyncHandler from 'express-async-handler'
import servicesModel from '../models/servicesModel.js'

const router = express.Router()

router.post('/clean-urls', asyncHandler(async (req, res) => {
  await servicesModel.cleanTransitions()

  res.json({
    success: true,
  })
}))

router.get('/os_up', asyncHandler(async (req, res) => {
  await servicesModel.updateOsVers()

  res.json({
    success: true,
  })
}))

export default router
