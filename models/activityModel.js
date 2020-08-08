import db from '../db/index.js'
import AbstractModel from './AbstractModel.js'

class ActivityModel extends AbstractModel {
  async add(userId, activities) {
    const preparedActivitiesData = activities.map((item) => {
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
    const keys = Object.keys(preparedActivitiesData[0]).join(', ')
    const {nearestElemsData, targetElemData} = activities[0]

    let index = 0
    for (const item of preparedActivitiesData) {
      const value = `(${userId}, ${this.normalizeValues(item)})${index + 1 === preparedActivitiesData.length ? '' : ', '}`
      const sql = `INSERT INTO activities (user_id, ${keys}) VALUES ${value}`
      await this.query(sql)
      const id = await this.getLastId()
      await this.addElems(id, targetElemData, nearestElemsData)
      index++
    }

    return true
  }

  async addElems(activityId, target, nearest) {
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
    const keys = Object.keys(elems[0]).join(', ')

    const values = elems.reduce((acc, item, i, array) => {
      acc += `(${this.normalizeValues(item)})${i + 1 === array.length ? '' : ', '}`
      return acc
    }, '')

    const selectSql = `INSERT INTO elements (${keys}) VALUES ${values}`
    await this.query(selectSql)
  }

  getOrientationId(orientation) {
    const orientations = {
      'landscape-primary': 1,
      'portrait-primary': 2,
    }
    return orientations[orientation]
  }

  async getTags() {
    const selectSql = 'SELECT * FROM elem_tags'
    return await this.query(selectSql)
  }

  async getTagId(tags, tagName) {
    const tag = tags.find(({name}) => name === tagName)
    return tag ? tag.id : await this.addTagName(tagName)
  }

  async addTagName(tagName) {
    const insertSql = `INSERT INTO elem_tags(name) VALUES ("${tagName}")`
    await this.query(insertSql)
    return this.getLastId()
  }

  normalizeValues(values) {
    return Object.values(values)
      .map((item) => (typeof item === 'string' ? `'${item}'` : Math.round(item)))
      .join(', ')
  }
}

export default new ActivityModel(db.pool)
