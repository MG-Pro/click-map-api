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

  normalizeValues(values) {
    return Object.values(values)
      .map((item) => (typeof item === 'string' ? `'${item}'` : Math.round(item)))
      .join(', ')
  }

  createDataObject(data) {
    try {
      const {visitorId, token, items} = JSON.parse(data)
      return {
        visitorId,
        token,
        transitions: items.map((item) => ({
          screenWidth: item[0],
          orientation: item[1],
          timeStamp: item[2],
          lang: item[3],
          platform: item[4],
          userAgent: item[5],
          pageUri: item[6],
        })),
      }
    } catch (e) {
      throw {type: 'APP', error: new Error('Error create data object from request body')}
    }
  }
}

export default new DataModel(db.pool)
