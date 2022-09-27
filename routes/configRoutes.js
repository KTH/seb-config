const express   = require('express')
const sebCg     = require('../configGen.js')
const { proxyPath } = require('./utils');
const convert   = require('xml-js')
const logger            = require('pino')()
      
const router    = express.Router({mergeParams: true});

//index route
router.get(proxyPath(''), function(req, res){
  res.render('index');
});

router.post(proxyPath('config'), function (req, res) {
  // Case for User Generated configs
  if (Object.keys(req.query).length === 0) { // handle cases with and withour param just in case
    var courseID = req.body.courseID
    var limit = req.body.limit
    // limit (previously cVar) switches array between regex options. 
    // One allows any CourseID, another allows only one CourseID
    if (req.body.limit === "0") { // "0" becasue js is js
      var courseID = 'Universal'
      var limit = 0
    } else if (!req.body.limit) {
      var courseID = req.body.courseID
      req.body.limit = 1
    } else {
      var courseID = req.body.courseID
      var limit = Number(req.body.limit)
    } 
  } 
  
  // Case for Query Generated configs

  else { // Query POST Request handling
    if (req.query.limit === "0") {
      var courseID = 'Universal'
      var limit = 0
    } 
    else if (!req.query.limit && req.query.courseID) {
      var courseID = req.query.courseID
      var limit = 1
    } 
    else {
      var courseID = req.query.courseID
      var limit = req.query.limit
    } 
  }

  var patt = /^[0-9]*$/
  if (patt.test(courseID) || limit ==! 1) { // allow "Universal" to pass for limit=0
    logger.info(`Generating SEB Config for CourseID: ${courseID}.`);
    var config = sebCg.generateSEBConfig(courseID, limit)
    var filename = `SebClientSettings-${courseID}.seb`
    const writeOptions = { compact: false, ignoreComment: false, spaces: 2, fullTagEmptyElement: true }
    const file = convert.js2xml(config, writeOptions)

    res.set({'Content-Disposition': 'attachment; filename='+filename,'Content-type': 'text/seb'});
    res.send(file);
  } else {
    res.status(400).send('Bad Request')
    logger.error(`${res.statusCode} Body: ${JSON.stringify(req.body)}, Query: ${JSON.stringify(req.query)}`)
  } 
});

module.exports = router