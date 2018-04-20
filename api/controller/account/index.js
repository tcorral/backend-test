const { Router } = require('express')
const getInfo = require('./get-info.js')
const create = require('./create.js')

module.exports = db => {
  const router = Router()

  router[create.method](create.route, create.controller(db))
  router[getInfo.method](getInfo.route, getInfo.controller(db))
  return router
}
