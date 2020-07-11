import express from 'express'
import db from '../db/index.js'

const router = express.Router()

router.get('/', (req, res) => {
  db.pool.query('SELECT * FROM test')
    .then((result) => res.json(result[0]))
})

export default router
