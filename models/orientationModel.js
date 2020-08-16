import AbstractModel from './AbstractModel.js'
import db from '../db/index.js'

class OrientationModel extends AbstractModel {
  constructor(pool) {
    super(pool)
    this.orientations = []
  }
  
  async getOrientations() {
    if (this.orientations.length) {
      return this.orientations
    }
  
    const sqlSelect = 'SELECT * FROM orientations'
    this.orientations = await this.query(sqlSelect)
    console.log(this.orientations)
  }
  
  async getOrientationId(orientationName) {
    await this.getOrientations()
    const orientation = this.orientations.find(({name}) => orientationName === name)
    if (orientation) {
      return orientation.id
    }
    return await this.add(orientationName)
  }

  async getOrientationValue(id) {
    await this.getOrientations()
    
    const object = this.orientations.find(({id: itemId}) => itemId === id) || {}
    return object.name
  }
  
  async add(orientationName) {
    const sqlInsert = `INSERT INTO orientations(name) VALUES ("${orientationName}")`
    await this.query(sqlInsert)
    return this.getLastId()
  }
}

export default new OrientationModel(db.pool)
