const express = require('express')
const expressSanitizer = require('express-sanitizer')
const bodyParser = require('body-parser')
const logger = require('pino')()
const ejs = require('ejs')
const PROXY_PATH_PREFIX = process.env.PROXY_PATH_PREFIX || '/'

// Route links
const rootRoutes = require('./routes/rootRoutes')

// Express
const app = express()

// App Config
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressSanitizer())

app.use(PROXY_PATH_PREFIX, express.static(__dirname))
app.set('view engine', 'ejs')

// Use Routes
app.use(PROXY_PATH_PREFIX, rootRoutes)

// server is listening.....
app.listen(process.env.PORT || 3000, function () {
  const port = this.address().port
  logger.info('seb-config is listening on port ' + port + '!')
})
