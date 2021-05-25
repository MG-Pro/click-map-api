import express from 'express'
import asyncHandler from 'express-async-handler'
import Parser from 'objects-to-csv'
import userModel from '../models/userModel.js'
import transitionModel from '../models/transitionModel.js'

const router = express.Router()

router.get('/list', asyncHandler(async (req, res) => {
  const list = await userModel.getList()

  res.json({
    success: true,
    data: list,
  })
}))

router.get('/session-by-user', asyncHandler(async (req, res) => {
  const userId = req.query.id

  if (!userId) {
    throw new Error('User ID not transmitted')
  }

  const list = await userModel.getList(userId)

  res.json({
    success: true,
    data: list,
  })
}))

router.get('/all-session', asyncHandler(async (req, res) => {
  const list = await userModel.flatSections()

  res.json({
    success: true,
    data: list,
  })
}))

router.get('/all-session-csv', asyncHandler(async (req, res) => {
  const list = await userModel.flatSections()

  const parser = new Parser(list)
  const csv = await parser.toString(true, false)
  res.header('Content-Type', 'text/csv')
  res.attachment('data.csv')
  res.send(csv)
}))

router.get('/os_up', asyncHandler(async (req, res) => {
  await transitionModel.updateOsVers()

  res.json({
    success: true,
  })
}))
export default router
