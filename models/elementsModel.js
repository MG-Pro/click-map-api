import db from '../db/index.js'
import AbstractModel from './AbstractModel.js'

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
      acc += `(${this.normalizeActivityValues(item)})${i + 1 === array.length ? '' : ', '}`
      return acc
    }, '')

    const sqlInsert = `INSERT INTO elements (${sqlKeys}) VALUES ${values}`
    await this.query(sqlInsert)
  }

  async getByActivityId(activityId) {
    const sqlSelect = `SELECT * FROM elements WHERE activity_id=${activityId}`
    return await this.query(sqlSelect)
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
}

export default new ElementsModel(db.pool)