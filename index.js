import express from 'express'
import bodyParser from 'body-parser'
import transitions from './routes/transitions.js'
import users from './routes/users.js'
import statics from './routes/static.js'
import db from './db/index.js'
import errorHandler from './middlewares/errorHandler.js'

const app = express()
const port = 3000

app.set('trust proxy', true)

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
app.use(bodyParser.text())

app.use('/api/transitions', transitions)
app.use('/api/users', users)
app.use('/', statics)

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server start on port ${port}`)
  if (db.error) {
    console.error('DB connection error!')
    process.exit(1)
  }
})
