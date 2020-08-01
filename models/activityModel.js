import db from '../db/index.js'
import AbstractModel from './AbstractModel.js'

class ActivityModel extends AbstractModel {
  constructor(pool) {
    super()
    this.pool = pool
  }

  async add(userId, activities) {
    const {nearestElemsData, targetElemData} = activities[0]
    
    const values = activities.reduce((acc, item, i, array) => {
      delete item.nearestElemsData
      delete item.targetElemData
      item.orientation_id = this.getOrientationId(item.orientation)
      delete item.orientation
      
      acc += `(${userId}, ${this.normalizeValues(item)})${i + 1 === array.length ? '' : ', '}`
      return acc
    }, '')
    
    const keys = Object.keys(activities[0]).join(', ')
    
    const sql = `INSERT INTO activities (user_id, ${keys}) VALUES ${values}`
    console.log(sql)
    this.interceptor(await this.query(sql))
    const id = this.interceptor(await this.query('SELECT @@IDENTITY'))
    await this.addElems(id, targetElemData, nearestElemsData)
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
        target: item.target,
      }
      elems.push(data)
    }
   
    
    console.log(elems)
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
    const tags = this.interceptor(await this.query(selectSql))
    console.log(tags)
    return {}
  }
  
  async getTagId(tags, tagName) {
    const tag = tags[tagName]
    return tag || await this.addTagName(tagName)
  }
  
  async addTagName(tagName) {
    const insertSql = `INSERT INTO elem_tags(name) VALUES ("${tagName}")`
    await this.query(insertSql)
    return this.interceptor(await this.query('SELECT @@IDENTITY'))
  }
  
  normalizeValues(values) {
    return Object.values(values)
      .map((item) => (typeof item === 'string' ? `'${item}'` : Math.round(item)))
      .join(', ')
  }
}

export default new ActivityModel(db.pool)
