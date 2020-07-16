class AbstractModel {
  async query(query) {
    try {
      const result = await this.pool.query(query)
      return result[0]
    } catch (e) {
      this.logError(e)
      return new Error(e)
    }
  }

  interceptor(result) {
    return result instanceof Error ? false : result
  }

  logError(error) {
    console.log(error)
  }
}

export default AbstractModel
