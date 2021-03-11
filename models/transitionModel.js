import db from '../db/index.js'
import AbstractModel from './AbstractModel.js'
import dataModel from './dataModel.js'

class TransitionModel extends AbstractModel {
  async add(visitorId, transitions, ip) {
    const preparedTransitionsData = await this.createPreparedTransitions(transitions)
    const sqlKeys = Object.keys(preparedTransitionsData[0]).join(', ')

    for (const item of preparedTransitionsData) {
      const value = `${visitorId}, ${dataModel.normalizeValues(item)}`
      const sqlInsert = `INSERT INTO transitions (visitor_id, ${sqlKeys}, ip) VALUES (${value}, ${ip})`
      console.log(sqlInsert)
      // await this.query(sqlInsert)
    }

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

  async createPreparedTransitions(transitions) {
    const preparedTransitions = []

    for (const item of transitions) {
      const {
        screenWidth,
        orientation,
        timestamp,
        lang,
        platform,
        userAgent,
        pageUri,
        cpuCores,
      } = item

      const {protocol, hostname, port, search, pathname} = dataModel.splitUrl(pageUri)
      const {browser, engine, os, cpu} = dataModel.getBrowserInfo(userAgent)

      preparedTransitions.push({
        orientation: dataModel.orientationMap[orientation],
        screen_width: screenWidth,
        page_uri: pageUri,
        user_agent: userAgent,
        timestamp,
        lang,
        platform,
        protocol,
        hostname,
        port,
        search_params: search,
        pathname,
        browser_ver: browser.version,
        browser_name: browser.name,
        browser_engine: engine.name,
        os_name: os.name,
        os_ver: os.version,
        cpu_arch: cpu.architecture,
        cpu_cores: cpuCores,
      })
    }

    return preparedTransitions
  }
}

export default new TransitionModel(db.pool)
