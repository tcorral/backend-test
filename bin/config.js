const process = require('process')
const config = require('../api/lib/config.js')

// eslint-disable-next-line
const [a, b, type, ...args] = process.argv

switch (type) {
  case 'list':
    console.log(config.list)
    break
  case 'current':
    console.log(config.current)
    break
  case 'get':
    const [key] = args
    if (!args) {
      console.error('Missing variable name.')
      break
    }
    console.log(config.get(key))
    break
  default:
    console.error('Missing command.')
}
