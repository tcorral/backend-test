const { Router } = require('express')
const create = require('./create.js')

module.exports = db => {
  const router = Router()

  router[create.method](create.route, create.controller(db))
  return router
}
