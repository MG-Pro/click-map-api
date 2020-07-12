import express from 'express'

const router = express.Router()

router.get('*', (req, res) => {
  res.send('<h1 style="font-family: sans-serif">ClickMap API</h1>')
})

export default router
