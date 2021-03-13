import userAgentParser from 'ua-parser-js'
import db from '../db/index.js'
import AbstractModel from './AbstractModel.js'

class DataModel extends AbstractModel {
  get orientationMap() {
    return {
      'landscape-primary': 0,
      'portrait-primary': 1,
      'landscape-secondary': 2,
      'portrait-secondary': 3,
    }
  }

  get protocolMap() {
    return {
      'http:': 0,
      'https:': 1,
    }
  }

  decodeData(encodedData) {
    try {
      const decodedData = encodedData.split('').reduce((acc, sym) => {
        acc += String.fromCharCode(sym.charCodeAt(0) ^ 123)
        return acc
      })
      return JSON.parse(decodedData ?? {})
    } catch (e) {
      throw {type: 'APP', error: new Error('Error encode data')}
    }
  }

  stringifyValues(values) {
    return Object.values(values)
      .map((item) => (typeof item === 'string' ? `'${item}'` : Math.round(item)))
      .join(', ')
  }

  createDataObject({visitorId, token, items, dev}) {
    try {
      return {
        visitorId,
        token,
        dev: dev ? 1 : 0,
        transitions: items.map((item) => ({
          screenWidth: item[0],
          orientation: item[1],
          timestamp: item[2],
          lang: item[3].slice(0, 2),
          platform: item[4],
          userAgent: item[5],
          pageUri: item[6],
          cpuCores: item[7],
        })),
      }
    } catch (e) {
      throw {type: 'APP', error: new Error('Error create data object from request body')}
    }
  }

  splitUrl(pageUri) {
    return new URL(pageUri)
  }

  getBrowserInfo(ua) {
    return userAgentParser(ua)
  }
}

export default new DataModel(db.pool)
