import db from '../db/index.js'
import AbstractModel from './AbstractModel.js'

class DataModel extends AbstractModel {
  encodeData(encodedData) {
    try {
      const decodedData = encodedData.split('').reduce((acc, sym) => {
        acc += String.fromCharCode(sym.charCodeAt(0) ^ 123)
        return acc
      })
      return JSON.parse(decodedData || {})
    } catch (e) {
      throw {type: 'APP', error: new Error('Error encode data')}
    }
  }
}

export default new DataModel(db.pool)
