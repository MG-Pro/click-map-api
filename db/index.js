import mysql from 'mysql2/promise.js'
import config from '../config.js'

console.log(config.dbSettings)
const {
  host,
  user,
  database,
  password,
} = config.dbSettings

const pool = mysql.createPool({
  connectionLimit: 5,
  host,
  user,
  database,
  password,
})

export default pool
