const logger            = require('pino')()

const express = require('express')
const router = express.Router({ mergeParams: true })

router.get('', function (req, res) {
  res.redirect(proxyPath('/config'))
})

// universal404
router.get('404', function (req, res) {
  res.render('fourOhFour')
})

// catchall for 404
router.get('*', function (req, res) {
  logger.info('404ing, reason:')
  logger.info(req.params)
  res.redirect(proxyPath('404'))
})

module.exports = router
