import express from 'express'
import asyncHandler from 'express-async-handler'
import userModel from '../models/userModel.js'

const router = express.Router()

router.get('/list', asyncHandler(async (req, res) => {
  const list = await userModel.getList()

  res.json({
    success: true,
    users: list,
  })
}))

export default router
