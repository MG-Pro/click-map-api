import db from '../db/index.js'

class UserModel {
  constructor(pool) {
    this.pool = pool
  }
  
  async isExist(fingerprint) {
    const result = await this.pool
      .query(`SELECT id FROM users WHERE fingerprint=${fingerprint}`)
   
    return !!result[0].length
  }
  
  async add(fingerprint) {
    const result = await this.pool
      .query(`INSERT INTO users(fingerprint) VALUES ('${fingerprint}')`)
    console.log(result)
    return true
  }
}

const userModel = new UserModel(db.pool)

export default userModel
