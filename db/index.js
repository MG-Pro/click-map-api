import mongoose from 'mongoose'
import * as fs from 'fs'
import * as path from 'path'

const configPath = path.join('.', './config.json')
let config = null

if (fs.existsSync(configPath)) {
  try {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
  } catch (e) {
    console.log('Error DB Config')
  }
}

if (!config) {
  const {DB_HOST, DB_USER, DB_NAME, DB_PASS} = process.env

  if (DB_HOST && DB_USER && DB_NAME && DB_PASS) {
    config = {
      host: DB_HOST,
      user: DB_USER,
      database: DB_NAME,
      password: DB_PASS,
    }
  }
}

async function dbConnect() {
  const dbUrl = `mongodb://${config.host}:27017/${config.database}`
  try {
    await mongoose.connect(dbUrl, {
      user: config.user,
      pass: config.password,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('DB connected')
  } catch (e) {
    console.error('DB connection error!', e)
    process.exit(1)
  }
}

export default dbConnect
