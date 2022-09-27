const express   = require('express')
const { proxyPath } = require('./utils');
const sebCg     = require('../configGen.js')
const convert   = require('xml-js')
      
const router    = express.Router({mergeParams: true});

//index route
router.get(proxyPath(''), function(req, res){
  res.render('index');
});

router.post(proxyPath(''),function (req, res) {
  if (Object.keys(req.query).length === 0) { // handle cases with and withour param just in case
    var courseID = req.body.courseID
    var limit = req.body.limit
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
    console.info(`Generating SEB Config for CourseID: ${courseID}.`);
    var config = sebCg.generateSEBConfig(courseID, limit)
    var filename = `SebClientSettings-${courseID}.seb`
    const writeOptions = { compact: false, ignoreComment: false, spaces: 2, fullTagEmptyElement: true }
    const file = convert.js2xml(config, writeOptions)

    res.set({'Content-Disposition': 'attachment; filename='+filename,'Content-type': 'text/seb'});
    res.send(file);
  } else {
    res.status(400).send('Bad Request')
    console.log(res.statusCode)
    console.log(`Body: ${JSON.stringify(req.body)}`)
    console.log(`Query: ${JSON.stringify(req.query)}`)
  } 
});

module.exports = router