import db from '../db/index.js'
import AbstractModel from './AbstractModel.js'

class UserModel extends AbstractModel {
  async getByFingerprint(fingerprint) {
    const sqlSelect = `SELECT * FROM users WHERE fingerprint="${fingerprint}"`
    const result = await this.query(sqlSelect)
    return result[0]
  }

  async add(fingerprint) {
    const sqlInsert = `INSERT INTO users(fingerprint) VALUES ("${fingerprint}")`
    await this.query(sqlInsert)
    return this.getLastId()
  }

  async getList() {
    const sqlSelect = 'SELECT * FROM users u INNER JOIN activities a ON u.id = a.user_id GROUP BY a.user_id'
    const result = await this.query(sqlSelect)
    return result
  }
}

export default new UserModel(db.pool)
