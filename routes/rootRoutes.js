const { proxyPath } = require('./utils')
const logger = require('pino')()
const sebCg = require('../configGen.js')
const convert = require('xml-js')
const express = require('express')
const router = express.Router({ mergeParams: true })

// index route
router.get('/', function (req, res) {
  res.render('index')
})

// submit form and query handling
router.post('/q', function (req, res) {
  // Case for User (UI) Generated configs
  if (Object.keys(req.query).length === 0) { // if config generated via body and not via query
    var courseID = req.body.courseID // input from index
    var limit = req.body.limit // button value in index

    // `limit` switches between array positions containing two regex options
    // One allows access to url with any CourseID (unlimited),
    // another allows access to url with only one CourseID (limited).
    // extra logic to make it user-proof
    if (req.body.limit === '0' || req.body.limit && !req.body.courseID || !req.body.limit && !req.body.courseID) { // "0" becasue js is js
      var courseID = 'Universal'
      var limit = 0
    } else if (!req.body.limit && req.body.courseID) {
      var courseID = req.body.courseID
      req.body.limit = 1
    } else {
      var courseID = req.body.courseID
      var limit = parseInt(req.body.limit)
    }
  }

  // Case for Query Generated configs
  else { // Query POST Request handling
    // Here logic is actually useful
    // One can have a csv with courseIDs and 0 or 1 for limit
    // All rows can be populated
    if (req.query.limit === '0' || req.query.limit && !req.query.courseID || !req.query.limit && !req.query.courseID) {
      var courseID = 'Universal'
      var limit = 0
    } else if (!req.query.limit && req.query.courseID) {
      var courseID = req.query.courseID
      var limit = 1
    } else {
      var courseID = req.query.courseID
      // var limit = Number(req.query.limit)
      var limit = parseInt(req.query.limit)
    }
  }

  // Checking if we are not processing garbage from else{}
  const pattCourse = /^[0-9]+$/
  const pattLimit = /^[0-1]$/

  if ((pattCourse.test(courseID) || courseID === 'Universal') && pattLimit.test(limit)) { // allow "Universal" to pass for limit=0
    logger.info(`Generating SEB Config for CourseID: ${courseID}.`)
    const config = sebCg.generateSEBConfig(courseID, limit)
    const filename = `SebClientSettings-${courseID}.seb`
    const writeOptions = { compact: false, ignoreComment: false, spaces: 2, fullTagEmptyElement: true }
    const file = convert.js2xml(config, writeOptions)

    res.set({ 'Content-Disposition': 'attachment; filename=' + filename, 'Content-type': 'text/seb' })
    res.send(file)
  } else {
    res.status(400).send('Bad Request')
    logger.error(`${res.statusCode} Body: ${JSON.stringify(req.body)}, Query: ${JSON.stringify(req.query)}`)
  }
})

// universal404
router.get('/404', function (req, res) {
  res.render('fourOhFour')
})

router.get('/favicon.ico', function (req, res) {
  res.sendStatus(200)
})

// catchall for 404
router.get('*', function (req, res) {
  logger.info('404ing, reason:' + req.params)
  res.redirect(proxyPath('404'))
})

module.exports = router
