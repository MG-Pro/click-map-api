class AbstractModel {
  constructor(pool) {
    this.pool = pool
  }

  async query(query) {
    try {
      const result = await this.pool.query(query)
      return result[0]
    } catch (e) {
      this.logError(e)
    }
  }

  logError(error) {
    console.log(error)
    const sql = `INSERT INTO errors(error_message) VALUES ("${error}")`
    console.log(sql)
    this.query(sql)
  }

  async getLastId() {
    const result = await this.query('SELECT @@IDENTITY')
    return result[0]['@@IDENTITY']
  }
}

export default AbstractModel
