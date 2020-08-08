import db from '../db/index.js'
import AbstractModel from './AbstractModel.js'

class UserModel extends AbstractModel {
  async getByFingerprint(fingerprint) {
    const sql = `SELECT * FROM users WHERE fingerprint="${fingerprint}"`
    const result = await this.query(sql)
    return result[0]
  }

  async add(fingerprint) {
    const sql = `INSERT INTO users(fingerprint) VALUES ("${fingerprint}")`
    await this.query(sql)
    return this.getLastId()
  }
}

export default new UserModel(db.pool)
