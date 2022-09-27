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
    var cVar = req.body.cVar
    // TODO: can you explain i bit further here? I get that this is some sort of business logic, but it's really hard to understand. Can you add a comment about in which scenario cVar is 0, in which it doesn't exist and in which it exist and is non-zero?
    if (req.body.cVar === "0") { // "0" becasue js is js
      var courseID = 'Universal'
      var cVar = 0
    } else if (!req.body.cVar) {
      var courseID = req.body.courseID
      // It's generally bad practice to change the values of variables/objects outside of the scope of this function. If another function (a middleware for instance) reads req.body.cVar, they become 'time coupled', meaning that they have to be called in an exact order. I would prefer if you could handle cVar in another way.
      req.body.cVar = 1
    } else {
      var courseID = req.body.courseID
      var cVar = Number(req.body.cVar)
    } 
  } 
   // Why do you support both Posting a body and query params? 
  else { // Query POST Request handling
    if (req.query.cVar === "0") {
      var courseID = 'Universal'
      var cVar = 0
    } 
    else if (!req.query.cVar && req.query.courseID) {
      var courseID = req.query.courseID
      var cVar = 1
    } 
    else {
      var courseID = req.query.courseID
      var cVar = req.query.cVar
    } 
  }

  var patt = /^[0-9]*$/
  if (patt.test(courseID) || cVar ==! 1) { // allow "Universal" to pass for cVar=0
    console.info(`Generating SEB Config for CourseID: ${courseID}.`);
    var config = sebCg.generateSEBConfig(courseID, cVar)
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
