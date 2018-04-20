const knex = require('knex')
const { resolve } = require('path')
const config = require('./api/lib/config')

// Connect with sensible defaults.
const sqlite = knex({
  client: 'sqlite3',
  connection: {
    filename: resolve(__dirname, config.get('SQLITE'))
  },
  debug: config.get('DEBUG'),
  afterCreate: async (conn) => {
    await conn.run('PRAGMA foreign_keys = ON;')
    await conn.run('PRAGMA journal_mode = WAL;')
    await conn.run('PRAGMA auto_vacuum = INCREMENTAL')
  }
})

module.exports = sqlite
