import db from '../db/index.js'
import AbstractModel from './AbstractModel.js'

class UserModel extends AbstractModel {
  async getByVisitorId(fingerprint) {
    const sqlSelect = `SELECT * FROM users WHERE visitorId="${fingerprint}"`
    const result = await this.query(sqlSelect)
    return result[0]
  }

  async add(fingerprint) {
    const sqlInsert = `INSERT INTO users(fingerprint) VALUES ("${fingerprint}")`
    await this.query(sqlInsert)
    return this.getLastId()
  }

  async getList() {
    const sqlSelect = `
        SELECT u.id, COUNT(a.visitor_id), u.create_date as activities
        FROM users u
        INNER JOIN activities a on u.id = a.user_id
        GROUP BY u.id`

    return await this.query(sqlSelect)
  }
}

export default new UserModel(db.pool)
