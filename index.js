import express from 'express'
import activities from './routes/activities.js'
import db from './db/index.js'

const app = express()
const port = process.env.PORT || 3000

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  )
  next()
})

app.use('/api/activities', activities)

app.listen(port, () => {
  console.log(`Server start on port http://localhost:${port}`)
  if (db.error) {
    console.error('DB connection error!')
  }
})
