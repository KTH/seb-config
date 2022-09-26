const express   = require('express')
const sebCg     = require('../configGen.js')
const convert   = require('xml-js')
      
const router    = express.Router({mergeParams: true});

//index route
router.get('/', function(req, res){
  res.render('index');
});

router.post('/',function (req, res) {
  if (Object.keys(req.query).length === 0) { // handle cases with and withour param just in case
    var courseID = req.body.courseID
    var cVar = req.body.cVar
    if (req.body.cVar === "0") { // "0" becasue js is js
      var courseID = 'Universal'
      var cVar = 0
    } else if (!req.body.cVar) {
      var courseID = req.body.courseID
      req.body.cVar = 1
    } else {
      var courseID = req.body.courseID
      var cVar = Number(req.body.cVar)
    } 
  } 
    
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