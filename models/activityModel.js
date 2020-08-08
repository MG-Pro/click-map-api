import db from '../db/index.js'
import AbstractModel from './AbstractModel.js'

class ActivityModel extends AbstractModel {
  async add(userId, activities) {
    const preparedActivitiesData = this.createPreparedActivities(activities)
    const sqlKeys = Object.keys(preparedActivitiesData[0]).join(', ')
    const {nearestElemsData, targetElemData} = activities[0]

    for (const item of preparedActivitiesData) {
      const value = `${userId}, ${this.normalizeValues(item)}`
      const sqlInsert = `INSERT INTO activities (user_id, ${sqlKeys}) VALUES (${value})`
      console.log(sqlInsert)
      await this.query(sqlInsert)
      const newActivityId = await this.getLastId()
      await this.addDomElements(newActivityId, targetElemData, nearestElemsData)
    }

    return true
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
        orientation_id: this.getOrientationId(orientation),
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

  async addDomElements(activityId, target, nearest) {
    target.target = 1
    const tags = await this.getTags()
    const elems = []
    for (const item of nearest.concat(target)) {
      const data = {
        selector: item.selector,
        x: item.elemX,
        y: item.elemY,
        width: item.width,
        height: item.height,
        tag_id: await this.getTagId(tags, item.elemTag),
        activity_id: activityId,
        target: item.target || 0,
      }
      elems.push(data)
    }
    const sqlKeys = Object.keys(elems[0]).join(', ')

    const values = elems.reduce((acc, item, i, array) => {
      acc += `(${this.normalizeValues(item)})${i + 1 === array.length ? '' : ', '}`
      return acc
    }, '')

    const sqlInsert = `INSERT INTO elements (${sqlKeys}) VALUES ${values}`
    await this.query(sqlInsert)
  }

  getOrientationId(orientation) {
    const orientations = {
      'landscape-primary': 1,
      'portrait-primary': 2,
    }
    return orientations[orientation]
  }

  async getTags() {
    const sqlSelect = 'SELECT * FROM elem_tags'
    return await this.query(sqlSelect)
  }

  async getTagId(tags, tagName) {
    const tag = tags.find(({name}) => name === tagName)
    return tag ? tag.id : await this.addTagName(tagName)
  }

  async addTagName(tagName) {
    const sqlInsert = `INSERT INTO elem_tags(name) VALUES ("${tagName}")`
    await this.query(sqlInsert)
    return this.getLastId()
  }

  normalizeValues(values) {
    return Object.values(values)
      .map((item) => (typeof item === 'string' ? `'${item}'` : Math.round(item)))
      .join(', ')
  }
}

export default new ActivityModel(db.pool)
