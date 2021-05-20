import db from '../db/index.js'
import AbstractModel from './AbstractModel.js'
import dataModel from './dataModel.js'
import config from '../config/analize.js'

class TransitionModel extends AbstractModel {
  async add(visitorId, transitions, ip, dev) {
    let values = ''
    let sqlKeys
    let counter = 0

    for (const item of transitions) {
      const preparedTransitionData = this.prepareTransition(item)

      if (config.filterTrack && !preparedTransitionData.url.includes(config.host)) {
        continue
      }

      counter++

      let urlId = await this.getPageURL(preparedTransitionData.url)

      if (!urlId) {
        urlId = await this.savePageURL(preparedTransitionData.url)
      }

      sqlKeys = sqlKeys
        ?? `(visitor_id, url_id, ${Object.keys(preparedTransitionData).join(', ')}, ip, dev)`
      values += `(${visitorId}, ${urlId}, ${dataModel.stringifyValues(preparedTransitionData)}, '${ip}', ${dev}), `
    }

    if (!counter) {
      return false
    }

    const sqlInsert = `INSERT INTO transitions${sqlKeys} VALUES ${values}`
      .trim().replace(/,\s*$/, '')

    await this.query(sqlInsert, dev)
    return true
  }

  async getByUserId(visitorId) {
    const sqlSelect = `SELECT * FROM transitions WHERE visitor_id=${visitorId}`
    const transitions = await this.query(sqlSelect) || []

    if (!transitions.length) {
      return transitions
    }

    const list = []

    for (const transition of transitions) {
      const listItem = {
        visitor_id: +visitorId,
      }

      delete transition.orientation_id
      delete transition.visitor_id

      const index = list.findIndex((item) => item.page_uri === transition.page_uri)

      if (index < 0) {
        Object.assign(listItem, {
          page_uri: transition.page_uri,
          transitions_count: 0,
          transitions: [transition],
        })
        list.push(listItem)
      } else {
        list[index].transitions.push(transition)
      }
    }

    return list.map((item) => {
      item.activities_count = item.transitions.length
      return item
    })
  }

  prepareTransition(transition) {
    const {
      screenWidth,
      orientation,
      timestamp,
      lang,
      platform,
      userAgent,
      pageUri,
      cpuCores,
    } = transition

    const {protocol, hostname, port, search, pathname} = dataModel.splitUrl(pageUri)
    const {browser, engine, os, cpu} = dataModel.getBrowserInfo(userAgent)

    return {
      timestamp,
      url: pageUri,
      protocol: dataModel.protocolMap[protocol] ?? -1,
      hostname,
      pathname,
      port,
      search_params: search,
      screen_width: screenWidth,
      language: lang,
      orientation: dataModel.orientationMap[orientation] ?? -1,
      browser_ver: browser.major ?? '',
      browser_name: browser.name ?? '',
      browser_engine: engine.name ?? '',
      os_name: os.name ?? '',
      os_ver: os.version ?? '',
      cpu_arch: cpu.architecture ?? '',
      cpu_cores: cpuCores,
      platform,
    }
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

  async updateUrls() {
    const sqlSelect = 'SELECT url, url_id FROM transitions'
    const transitions = await this.query(sqlSelect) || []

    for (const transition of transitions) {
      if (!transition.url_id) {
        let id = await this.getPageURL(transition.url)
        if (!id) {
          id = await this.savePageURL(transition.url)
        }

        const sqlInsert = `INSERT INTO transitions(url_id) VALUES (${id})`
        await this.query(sqlInsert)
      }
    }
  }
}

export default new TransitionModel(db.pool)
