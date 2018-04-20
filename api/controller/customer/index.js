const { Router } = require('express')
const getInfo = require('./get-info.js')

module.exports = (db) => {
  const router = Router()

  router[getInfo.method](getInfo.route, getInfo.controller(db))
  return router
}
