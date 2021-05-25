import userAgentParser from 'ua-parser-js'
import db from '../db/index.js'
import AbstractModel from './AbstractModel.js'
import config from '../config/analize.js'

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

  langMap() {
    return {
      ru: 1,
      en: 2,
      fr: 3,
      uk: 4,
      es: 5,
      ka: 6,
      zh: 7,
      it: 8,
    }
  }

  osNameMap() {
    return {
      Windows: 1,
      Android: 2,
      iOS: 3,
      'Mac OS': 4,
      Linux: 5,
      Ubuntu: 6,
    }
  }

  platformMap() {
    return {
      Win32: 1,
      'Linux armv8l': 2,
      iPhone: 3,
      'Linux aarch64': 4,
      MacIntel: 5,
      'Linux armv7l': 6,
      'Linux x86_64': 7,
      iPad: 8,
      Android: 9,
      'Linux i686': 10,
      Windows: 11,
      Win64: 12,
      armv7I: 13,
    }
  }

  browserNameMap() {
    return {
      Chrome: 1,
      'Mobile Safari': 2,
      Yandex: 3,
      Opera: 4,
      GSA: 5,
      'Samsung Browser': 6,
      'MIUI Browser': 7,
      'Chrome WebView': 8,
      Safari: 9,
      Edge: 10,
      Firefox: 11,
      WebKit: 12,
      'Chrome Headless': 13,
      UCBrowser: 14,
      'Android Browser': 15,
      IE: 16,
      'Opera Touch': 17,
    }
  }

  async osVersionMap() {
    const sqlSelect = 'SELECT * FROM os_versions'
    const result = await this.query(sqlSelect)

    return result.reduce((acc, item) => {
      acc[item.name] = item.id
      return acc
    }, {})
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

  async getPageURL(url) {
    const sqlSelect = `
        SELECT *
        FROM pages
        WHERE url = "${url}"`
    const result = await this.query(sqlSelect)
    return result[0]?.id
  }

  async savePageURL(url) {
    const sqlInsert = `
        INSERT INTO pages(url)
        VALUES ("${url}")`
    await this.query(sqlInsert)
    return this.getLastId()
  }

  async getOsVersion(name) {
    const sqlSelect = `
        SELECT *
        FROM os_versions
        WHERE name = "${name}"`
    const result = await this.query(sqlSelect)
    return result[0]?.id
  }

  async saveOsVersion(name) {
    const sqlInsert = `
        INSERT INTO os_versions(name)
        VALUES ("${name}")`
    await this.query(sqlInsert)
    return this.getLastId()
  }

  transitionReduceMap() {
    return Object.entries(config.aliases).reduce((acc, [key, val]) => {
      val.forEach((pattern) => {
        acc[pattern] = key
      })
      return acc
    }, {})
  }
}

export default new DataModel(db.pool)
