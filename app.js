const express = require('express')

// Configuration
const config = require('./api/lib/config')

// Models
const db = require('./db.js')

// Middlewares
const bodyParser = require('body-parser') // Parses HTTP request body
const cors = require('cors') // Enables CORS
const helmet = require('helmet') // Security.
const morgan = require('morgan') // Logger.
const compression = require('compression') // GZip compression
const notFoundHandler = require('./api/lib/mw-404.js') // 404
const errorHandler = require('./api/lib/mw-500.js') // 500

// Routers
const account = require('./api/controller/account/index.js')
const customer = require('./api/controller/customer/index.js')

// Initialises the app.
const app = express()

// Loads Middlewares.
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(helmet())
app.use(morgan(config.get('MORGAN_LOGS')))
if (config.get('NODE_ENV') === 'production') {
  app.use(compression())
}

// Loads the controllers go here
const versionRouter = express.Router()
versionRouter.use('/account/', account(db))
versionRouter.use('/customer/', customer(db))

// Versioning your API is always a good idea.
app.use('/v1/', versionRouter)
app.use(notFoundHandler)
app.use(errorHandler)

const port = config.get('LISTEN_PORT')
app.listen(port, () => console.log(`Listening on port: ${port}`))
