import db from '../db/index.js'
import AbstractModel from './AbstractModel.js'

class UserModel extends AbstractModel {
  constructor(pool) {
    super()
    this.pool = pool
  }

  async getByFingerprint(fingerprint) {
    const sql = `SELECT * FROM users WHERE fingerprint="${fingerprint}"`
    return this.interceptor(await this.query(sql))[0]
  }

  async add(fingerprint) {
    const sql = `INSERT INTO users(fingerprint) VALUES ("${fingerprint}")`
    await this.query(sql)
    return this.interceptor(await this.query('SELECT @@IDENTITY'))
  }
}

export default new UserModel(db.pool)
