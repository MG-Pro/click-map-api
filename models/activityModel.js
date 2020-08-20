import db from '../db/index.js'
import AbstractModel from './AbstractModel.js'
import orientationModel from './orientationModel.js'
import elementsModel from './elementsModel.js'
import dataModel from './dataModel.js'

class ActivityModel extends AbstractModel {
  async add(userId, activities) {
    const preparedActivitiesData = await this.createPreparedActivities(activities)
    const sqlKeys = Object.keys(preparedActivitiesData[0]).join(', ')
    const {nearestElemsData, targetElemData} = activities[0]

    for (const item of preparedActivitiesData) {
      const value = `${userId}, ${dataModel.normalizeValues(item)}`
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
      activity.orientation = await orientationModel.getOrientationValue(activity.orientation_id)
      const elements = await elementsModel.getByActivityId(activity.id)
      activity.success = false
      activity.nearest_elements = []

      for (const element of elements) {
        element.tag = await elementsModel.getTagNameById(element.tag_id)

        if (element.target) {
          activity.target_element = element
          activity.success = this.isSuccessActivity(element)
        } else {
          activity.nearest_elements.push(element)
        }

        delete element.tag_id
        delete element.target
        delete element.activity_id
      }

      const listItem = {
        user_id: +userId,
      }

      delete activity.orientation_id
      delete activity.user_id

      const index = list.findIndex((item) => item.page_uri === activity.page_uri)

      if (index < 0) {
        Object.assign(listItem, {
          page_uri: activity.page_uri,
          activities_count: 0,
          activities: [activity],
        })
        list.push(listItem)
      } else {
        list[index].activities.push(activity)
      }
    }

    return list.map((item) => {
      item.activities_count = item.activities.length
      return item
    })
  }

  isSuccessActivity(targetElem) {
    const successTags = [
      'a',
      'button',
      'input',
      'select',
    ]

    return successTags.includes(targetElem.tag.toLowerCase())
  }

  async createPreparedActivities(activities) {
    const preparedActivities = []

    for (const item of activities) {
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

      preparedActivities.push({
        orientation_id: await orientationModel.getOrientationId(orientation),
        screen_width,
        click_x,
        click_y,
        scroll_x,
        scroll_y,
        page_uri,
        timestamp,
      })
    }

    return preparedActivities
  }
}

export default new ActivityModel(db.pool)
