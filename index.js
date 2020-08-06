import express from 'express'
import bodyParser from 'body-parser'
import activities from './routes/activities.js'
import statics from './routes/static.js'
import db from './db/index.js'

const app = express()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  )
  next()
})

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/api/activities', activities)
app.use('/', statics)

app.listen(3000, () => {
  console.log(`Server start on port http://localhost:${port}`)
  if (db.error) {
    console.error('DB connection error!')
    process.exit(1)
  }
})
