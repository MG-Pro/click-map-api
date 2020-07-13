import db from '../db/index.js'

class ActivityModel {
  constructor(pool) {
    this.pool = pool
  }

  async query(query) {
    try {
      const result = await this.pool(query)
      return result[0]
    } catch (e) {
      return new Error(e)
    }
  }

  async add(activities) {
    const entities = [
      'screen_width',
      'click_x',
      'click_y',
      'scroll_x',
      'scroll_y',
      'orientation',
      'elem_tag',
      'elem_selector',
      'user_id',
      'elem_x',
      'elem_y',
      'page_uri',
    ].join(', ')

    console.log(activities, entities)

    // await this.query(`INSERT INTO activities (${entities}) VALUES ('${activities}')`)
    return true
  }
}

const activityModel = new ActivityModel(db.pool)

export default activityModel
