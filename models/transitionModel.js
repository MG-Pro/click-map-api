import db from '../db/index.js'
import AbstractModel from './AbstractModel.js'
import dataModel from './dataModel.js'

class TransitionModel extends AbstractModel {
  async add(visitorId, transitions) {
    const preparedTransitionsData = await this.createPreparedTransitions(transitions)
    const sqlKeys = Object.keys(preparedTransitionsData[0]).join(', ')

    for (const item of preparedTransitionsData) {
      const value = `${visitorId}, ${dataModel.normalizeValues(item)}`
      const sqlInsert = `INSERT INTO transitions (visitor_id, ${sqlKeys}) VALUES (${value})`
      await this.query(sqlInsert)
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
        screen_width,
        orientation,
        page_uri,
        timestamp,
      } = item

      preparedTransitions.push({
        orientation_id: orientation,
        screen_width,
        page_uri,
        timestamp,
      })
    }

    return preparedTransitions
  }
}

export default new TransitionModel(db.pool)
