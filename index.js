import express from 'express'
import connection from './db'

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

app.listen(port, () => {
  console.log(`Server start on port ${port}!`)
  connection.connect()
})
