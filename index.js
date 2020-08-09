import express from 'express'
import bodyParser from 'body-parser'
import activities from './routes/activities.js'
import users from './routes/users.js'
import statics from './routes/static.js'
import dbConnect from './db/index.js'
import errorHandler from './middlewares/errorHandler.js'

const app = express()
const port = 3000

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
app.use('/api/users', users)
app.use('/', statics)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server start on port ${port}`)
  dbConnect()
})
