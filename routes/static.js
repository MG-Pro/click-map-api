import express from 'express'

const router = express.Router()

router.get('*', (req, res) => {
  res.send('<h1 style="font-family: sans-serif">ClickStream Storage API</h1>')
})

export default router
