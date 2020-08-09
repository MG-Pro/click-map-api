import AbstractModel from './AbstractModel.js'
import db from '../db/index.js'

class OrientationModel extends AbstractModel {
  constructor() {
    super()
    this.orientations = [
      {
        id: 1,
        name: 'landscape-primary',
      },
      {
        id: 2,
        name: 'portrait-primary',
      },
    ]
  }

  getOrientationId(orientation) {
    const object = this.orientations.find(({name}) => orientation === name)
    return object.id
  }

  getOrientationValue(id) {
    const object = this.orientations.find(({id: itemId}) => itemId === id)
    return object.name
  }
}

export default new OrientationModel(db.pool)
