class AbstractModel {
  constructor(pool) {
    this.pool = pool
  }

  async query(query) {
    try {
      const result = await this.pool.query(query)
      return result[0]
    } catch (error) {
      throw {type: 'SQL', error}
    }
  }

  async getLastId() {
    const result = await this.query('SELECT LAST_INSERT_ID()')
    return result[0]['LAST_INSERT_ID()']
  }
}

export default AbstractModel
