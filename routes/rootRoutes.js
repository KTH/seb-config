const { proxyPath } = require('./utils');

const express = require('express')
const router = express.Router({ mergeParams: true })

router.get(proxyPath(''), function (req, res) {
  res.redirect('/config')
})

// universal404
router.get(proxyPath('404'), function (req, res) {
  res.render('fourOhFour')
})

// catchall for 404
router.get('*', function (req, res) {
  // FIXME: you should use a json logging library like https://github.com/KTH/skog or pino, because these log lines will not be searchable in our logging system graylog.
  console.log('404ing, reason:')
  console.log(req.params)
  res.redirect(proxyPath('404'))
})

module.exports = router
