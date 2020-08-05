class AbstractModel {
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
  }

  async getLastId() {
    const result = await this.query('SELECT @@IDENTITY')
    return result[0]['@@IDENTITY']
  }
}

export default AbstractModel
