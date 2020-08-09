import AbstractModel from './AbstractModel.js'
import db from '../db/index.js'

class ErrorModel extends AbstractModel {
  logError(error) {
    const directError = error.type === 'SQL' ? error : {
      error,
      type: 'APP',
    }

    console.log(directError)
    if (process.env.NODE_ENV === 'development') {
      return directError
    }

    const sqlInsert = `
      INSERT INTO errors(error_message, type, env) 
      VALUES (
              "${directError.error}", 
              "${directError.type}", 
              "${process.env.NODE_ENV}"
              )`
    this.query(sqlInsert)
    return directError
  }
}

export default new ErrorModel(db.pool)
