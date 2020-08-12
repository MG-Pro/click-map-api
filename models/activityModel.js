import db from '../db/index.js'
import AbstractModel from './AbstractModel.js'
import orientationModel from './orientationModel.js'
import elementsModel from './elementsModel.js'

class ActivityModel extends AbstractModel {
  async add(userId, activities) {
    const preparedActivitiesData = this.createPreparedActivities(activities)
    const sqlKeys = Object.keys(preparedActivitiesData[0]).join(', ')
    const {nearestElemsData, targetElemData} = activities[0]

    for (const item of preparedActivitiesData) {
      const value = `${userId}, ${this.normalizeValues(item)}`
      const sqlInsert = `INSERT INTO activities (user_id, ${sqlKeys}) VALUES (${value})`
      await this.query(sqlInsert)
      const newActivityId = await this.getLastId()
      await elementsModel.addDomElements(newActivityId, targetElemData, nearestElemsData)
    }

    return true
  }

  async getByUserId(userId) {
    const sqlSelect = `
        SELECT * FROM activities WHERE user_id=${userId}
        `
    const activities = await this.query(sqlSelect) || []

    if (!activities.length) {
      return activities
    }

    for (const activity of activities) {
      activity.orientation = orientationModel.getOrientationValue(activity.orientation_id)
    }
    return activities
  }

  createPreparedActivities(activities) {
    return activities.map((item) => {
      const {
        click_x,
        click_y,
        screen_width,
        orientation,
        scroll_x,
        scroll_y,
        page_uri,
        timestamp,
      } = item

      return {
        orientation_id: orientationModel.getOrientationId(orientation),
        screen_width,
        click_x,
        click_y,
        scroll_x,
        scroll_y,
        page_uri,
        timestamp,
      }
    })
  }

  normalizeValues(values) {
    return Object.values(values)
      .map((item) => (typeof item === 'string' ? `'${item}'` : Math.round(item)))
      .join(', ')
  }
}

export default new ActivityModel(db.pool)
