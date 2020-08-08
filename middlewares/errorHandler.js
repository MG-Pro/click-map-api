import errorModel from '../models/errorModel.js'

function errorHandler(error, req, res, next) {
  errorModel.logError(error)
  res.json({success: false})
  next()
}

export default errorHandler
