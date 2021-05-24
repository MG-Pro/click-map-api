import db from '../db/index.js'
import AbstractModel from './AbstractModel.js'

class SessionModel extends AbstractModel {

}

export default new SessionModel(db.pool)
