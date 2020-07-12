import mysql from 'mysql2/promise.js'
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

const db = {error: true}

if (config) {
  db.pool = mysql.createPool({
    connectionLimit: 5,
    ...config,
  })
  db.error = false
}

export default db
