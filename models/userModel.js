import db from '../db/index.js'

class UserModel {
  constructor(pool) {
    this.pool = pool
  }

  async isExist(fingerprint) {
    try {
      const result = await this.pool
        .query(`SELECT id FROM users WHERE fingerprint=${fingerprint}`)

      return !!result[0].length
    } catch (e) {
      return e
    }
  }

  async add(fingerprint) {
    try {
      await this.pool.query(`INSERT INTO users(fingerprint) VALUES ('${fingerprint}')`)
      return true
    } catch (e) {
      return e
    }
  }
}

const userModel = new UserModel(db.pool)

export default userModel
