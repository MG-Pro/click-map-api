import db from '../db/index.js'

class UserModel {
  constructor(pool) {
    this.pool = pool
  }

  async query(query) {
    try {
      const result = await this.pool(query)
      return result[0]
    } catch (e) {
      return new Error(e)
    }
  }

  async isExist(fingerprint) {
    const result = await this.getByFingerprint(fingerprint)
    return result instanceof Error ? false : !!result
  }

  async getByFingerprint(fingerprint) {
    return this
      .query(`SELECT id FROM users WHERE fingerprint=${fingerprint}`)
  }

  async add(fingerprint) {
    await this.pool.query(`INSERT INTO users(fingerprint) VALUES ('${fingerprint}')`)
    return this.pool.query('SELECT @@IDENTITY')
  }
}

const userModel = new UserModel(db.pool)

export default userModel
