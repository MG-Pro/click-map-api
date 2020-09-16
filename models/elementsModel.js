import db from '../db/index.js'
import AbstractModel from './AbstractModel.js'
import dataModel from './dataModel.js'

class ElementsModel extends AbstractModel {
  constructor(pool) {
    super(pool)
    this.tags = []
  }

  async add(activityId, target, nearest) {
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
        tag_id: await this.getTagIdByName(tags, item.elemTag),
        activity_id: activityId,
        target: item.target || 0,
      }
      elems.push(data)
    }
    const sqlKeys = Object.keys(elems[0]).join(', ')

    const values = elems.reduce((acc, item, i, array) => {
      acc += `(${dataModel.normalizeValues(item)})${i + 1 === array.length ? '' : ', '}`
      return acc
    }, '')

    const sqlInsert = `INSERT INTO elements (${sqlKeys}) VALUES ${values}`
    await this.query(sqlInsert)
  }

  async getByActivityId(activityId) {
    const sqlSelect = `SELECT * FROM elements WHERE activity_id=${activityId}`
    return await this.query(sqlSelect)
  }

  async getAllByUri(uri) {
    const sqlSelect = `
        SELECT e.id       as element_id,
               e.selector as css_selector,
               et.name    as tag_name,
               e.target   as is_target,
               e.visible  as is_visible,
               e.x        as element_x,
               e.y        as element_y,
               e.width    as element_width,
               e.height   as element_height,
               a.screen_width,
               o.name     as orientation,
               a.id as activity_id,
               a.click_x,
               a.click_y,
               a.scroll_x,
               a.scroll_y,
               a.page_uri,
               u.fingerprint as user_fingerprint,
               a.timestamp
        FROM elements e
               INNER JOIN activities a ON e.activity_id = a.id 
                    AND a.page_uri = '${uri}'
               INNER JOIN elem_tags et ON e.tag_id = et.id
               INNER JOIN orientations o ON a.orientation_id = o.id
               INNER JOIN users u ON a.user_id = u.id`

    const elements = await this.query(sqlSelect)

    return elements.reduce((acc, item) => {
      if (!acc[item.page_uri]) {
        acc[item.page_uri] = {
          elements_count: 1,
          activities_count: 1,
          elements: [item],
        }
      } else {
        acc[item.page_uri].elements_count++
        acc[item.page_uri].elements.push(item)
      }
      delete item.page_uri
      item.is_success = this.isSuccess(item)
      return acc
    }, {})
  }

  isSuccess(element) {
    const successTags = [
      'button',
      'a',
      'input',
      'select',
    ]

    return element.is_target && successTags.includes(element.tag_name.toLowerCase()) ? 1 : 0
  }

  async getCountByActivityId(activityId) {
    const sqlSelect = `SELECT COUNT(elements.id) FROM elements WHERE activity_id=${activityId}`
    const result = await this.query(sqlSelect)
    return result[0]['COUNT(elements.id)']
  }

  async getTags() {
    if (this.tags.length) {
      return this.tags
    }

    const sqlSelect = 'SELECT * FROM elem_tags'
    return await this.query(sqlSelect)
  }

  async getTagIdByName(tags, tagName) {
    const tag = tags.find(({name}) => name === tagName)
    return tag ? tag.id : await this.addTagName(tagName)
  }

  async getTagNameById(tagId) {
    const tags = await this.getTags()
    return (tags.find((tag) => tag.id === tagId) || {}).name
  }

  async addTagName(tagName) {
    const sqlInsert = `INSERT INTO elem_tags(name) VALUES ("${tagName}")`
    await this.query(sqlInsert)
    return this.getLastId()
  }

  async removeByActivityId(activityId) {
    const sqlDelete = `DELETE FROM elements WHERE activity_id=${activityId}`
    await this.query(sqlDelete)
  }

  async autoRemove() {
    const sqlDelete = `
        DELETE
        FROM elements
        WHERE elements.activity_id NOT IN (SELECT activities.id FROM activities)`
    const result = await this.query(sqlDelete)
    return result.affectedRows
  }
}

export default new ElementsModel(db.pool)
