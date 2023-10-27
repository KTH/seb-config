const sebCg = require('./configGen')
const courseID = 1234
const testConfigCourseID = sebCg.generateSEBConfig(courseID, 1)
const testConfigUniversal = sebCg.generateSEBConfig(courseID, 0)

test('1. Rules included = rules enabled', () => {
  expect(testConfigCourseID.elements[1].elements[0].elements[237].elements.length).toEqual(testConfigCourseID.elements[1].elements[0].elements[245].elements[0].text.split(';').length)
})
test('2. Rule Count = 23 (Sept 2022)', () => {
  expect(testConfigCourseID.elements[1].elements[0].elements[237].elements.length).toEqual(23)
})
test('3. CourseID based config contains Course ID start URL', () => {
  expect(testConfigCourseID.elements[1].elements[0].elements[3].elements[0].text).toContain(`https://kth.se/seb-redirect/redirect?cid=${courseID}`)
})
test('4. CourseID Regex Pass', () => {
  const testRegArr = (testConfigCourseID.elements[1].elements[0].elements[245].elements[0].text).split(';')
  const testPatt = new RegExp(testRegArr[1])
  const result = testPatt.test(`canvas.kth.se/courses/${courseID}`)
  expect(result).toBeTruthy()
})
test('5. Universal Regex Pass', () => {
  const testRegArr = (testConfigUniversal.elements[1].elements[0].elements[245].elements[0].text).split(';')
  const testPatt = new RegExp(testRegArr[1])
  const result = testPatt.test('canvas.kth.se/courses/4567')
  expect(result).toBeTruthy()
})
