const { proxyPath }     = require('./utils');
const logger            = require('pino')()

const express = require('express')
const router = express.Router({ mergeParams: true })

router.get(proxyPath(''), function (req, res) {
  res.render('index')
})

// universal404
router.get(proxyPath('404'), function (req, res) {
  res.render('fourOhFour')
})

router.get('/favicon.ico', function (req, res) {
  res.sendStatus(200);
})

// catchall for 404
router.get('*', function (req, res) {
  logger.info('404ing, reason:')
  logger.info(req.params)
  res.redirect(proxyPath('404'))
})

module.exports = router
