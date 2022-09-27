const express           = require('express')
const expressSanitizer  = require('express-sanitizer')
const bodyParser        = require('body-parser')
const { proxyPath } = require('./routes/utils');

// TODO This import is never used. Should it be?
const ejs               = require('ejs')

// Route links
const configRoutes  = require('./routes/configRoutes')
const rootRoutes    = require('./routes/rootRoutes')

// Express
const app = express()

// App Config
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressSanitizer())

// Tell monitoring system that application is up and running
app.get(proxyPath('_monitor'), (req, res) => {
  res.send("APPLICATION_STATUS: OK\n");
})

app.use(proxyPath(''), express.static(__dirname))
// TODO: Should this be a string, or the imported ejs above?
app.set('view engine', 'ejs')


// Use Routes
app.use('/config', configRoutes)
app.use(rootRoutes)

// server is listening.....
app.listen(process.env.PORT || 3000, function () {
  const port = this.address().port
  console.log('SEB-CG is listening on port ' + port + '!')
})
