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
      const value = `${userId}, ${this.normalizeActivityValues(item)}`
      const sqlInsert = `INSERT INTO activities (user_id, ${sqlKeys}) VALUES (${value})`
      await this.query(sqlInsert)
      const newActivityId = await this.getLastId()
      await elementsModel.add(newActivityId, targetElemData, nearestElemsData)
    }

    return true
  }

  async getByUserId(userId) {
    const sqlSelect = `SELECT * FROM activities WHERE user_id=${userId}`
    const activities = await this.query(sqlSelect) || []

    if (!activities.length) {
      return activities
    }

    const list = []

    for (const activity of activities) {
      activity.orientation = orientationModel.getOrientationValue(activity.orientation_id)
      delete activity.orientation_id
      const elements = await elementsModel.getByActivityId(activity.id)
      activity.nearest_elements = []

      for (const element of elements) {
        element.tag = await elementsModel.getTagNameById(element.tag_id)
        delete element.tag_id

        if (element.target) {
          delete element.target
          delete element.activity_id
          activity.target_element = element
        } else {
          delete element.target
          delete element.activity_id
          activity.nearest_elements.push(element)
        }
      }

      const listItem = {
        user_id: +userId,
      }

      delete activity.user_id

      const index = list.findIndex((item) => item.page_uri === activity.page_uri)

      if (index < 0) {
        Object.assign(listItem, {
          page_uri: activity.page_uri,
          activities: [activity],
        })
        list.push(listItem)
      } else {
        list[index].activities.push(activity)
      }
    }

    return list
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

  normalizeActivityValues(values) {
    return Object.values(values)
      .map((item) => (typeof item === 'string' ? `'${item}'` : Math.round(item)))
      .join(', ')
  }
}

export default new ActivityModel(db.pool)
