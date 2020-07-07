import express from 'express'
import pool from '../db/index.js'

const router = express.Router()

router.get('/', (req, res) => {
  pool.query('SELECT * FROM activities')
    .then((result) => res.json(result[0]))
})

export default router
