const { env } = require('process')

const config = {
  LISTEN_PORT: 8080,
  MORGAN_LOGS: 'combined',
  SQLITE: './sqlite.db',
  DEBUG: false
}

const get = (key) => {
  if (env[key] != null) {
    return env[key]
  }
  return config[key]
}

const list = Object.keys(config)
const current = list.map(key => `${key} => ${get(key)}`)

module.exports = {
  current,
  get,
  list
}
