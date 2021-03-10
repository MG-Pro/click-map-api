import db from '../db/index.js'
import AbstractModel from './AbstractModel.js'

class UserModel extends AbstractModel {
  async getByVisitorId(visitorId) {
    const sqlSelect = `SELECT * FROM visitors WHERE visitor_id="${visitorId}"`
    const result = await this.query(sqlSelect)
    return result[0]
  }

  async add(visitorId) {
    const sqlInsert = `INSERT INTO visitors(visitor_id) VALUES ("${visitorId}")`
    console.log(sqlInsert, visitorId.length)
    await this.query(sqlInsert)
    return this.getLastId()
  }

  async getList() {
    const sqlSelect = `
        SELECT v.id, COUNT(a.visitor_id), v.create_date AS transitions
        FROM visitors v
        INNER JOIN transitions a ON v.id = a.visitor_id
        GROUP BY v.id`

    return await this.query(sqlSelect)
  }
}

export default new UserModel(db.pool)
