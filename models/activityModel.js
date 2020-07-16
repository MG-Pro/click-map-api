import db from '../db/index.js'
import AbstractModel from './AbstractModel.js'

class ActivityModel extends AbstractModel {
  constructor(pool) {
    super()
    this.pool = pool
  }

  async add(userId, activities) {
    const keys = Object.keys(activities[0]).join(', ')
    let values = ''

    activities.forEach((item, i, array) => {
      values += `(${userId}, ${this.normalizeValues(item)})${i + 1 === array.length ? '' : ', '}`
    })

    const sql = `INSERT INTO activities (user_id, ${keys}) VALUES ${values}`
    console.log(sql)
    return this.interceptor(await this.query(sql))
  }

  normalizeValues(values) {
    return Object.values(values)
      .map((item) => (typeof item === 'string' ? `'${item}'` : Math.round(item)))
      .join(', ')
  }
}

export default new ActivityModel(db.pool)
