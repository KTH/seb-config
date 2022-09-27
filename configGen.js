const convert = require('xml-js')
const fs = require('fs')

function generateSEBConfig (courseID, limit) {
  const xml = fs.readFileSync('template.xml', 'utf8')
  const readOptions = { ignoreComment: false, alwaysChildren: true }
  const sebConfig = convert.xml2js(xml, readOptions)
  let ruleString = ''
  const ruleArr = []
  const rCfgArr = ['\\/([0-9]+)', `\\/${courseID}`]
  const sCfgArr = ['seb-redirect', `seb-redirect/redirect?cid=${courseID}`]
  const regexArr = [
    '([\\w\\d]+\\.)?canvas\\.kth\\.se(\\/)?$',
      `([\\w\\d]+\\.)?canvas\\.kth\\.se\\/courses${rCfgArr[limit]}?$`,
      `([\\w\\d]+\\.)?canvas\\.kth\\.se\\/courses${rCfgArr[limit]}\\/assignments(\\/.*)?$`,
      `([\\w\\d]+\\.)?canvas\\.kth\\.se\\/courses${rCfgArr[limit]}\\/external_tools\\/retrieve(.*?)$`,
      `([\\w\\d]+\\.)?canvas\\.kth\\.se\\/courses${rCfgArr[limit]}\\/modules(\\/.*)?$`,
      `([\\w\\d]+\\.)?canvas\\.kth\\.se\\/courses${rCfgArr[limit]}\\/modules/items/([0-9]+)?$`,
      `([\\w\\d]+\\.)?canvas\\.kth\\.se\\/courses${rCfgArr[limit]}\\/modules\\#module_([0-9]+)$`,
      `([\\w\\d]+\\.)?canvas\\.kth\\.se\\/courses${rCfgArr[limit]}\\/pages\\/([a-zA-Z0-9_.-]+)\\?module_item_id=([0-9]+)$`,
      `([\\w\\d]+\\.)?canvas\\.kth\\.se\\/courses${rCfgArr[limit]}\\/files\\/([a-zA-Z0-9_.-]+)\\?module_item_id=([0-9]+)$`,
      `([\\w\\d]+\\.)?canvas\\.kth\\.se\\/courses${rCfgArr[limit]}\\/quizzes(\\/.*)?$`,
      `([\\w\\d]+\\.)?canvas\\.kth\\.se\\/courses${rCfgArr[limit]}\\/student_view(\\/.*)?$`,
      `([\\w\\d]+\\.)?canvas\\.kth\\.se\\/courses${rCfgArr[limit]}\\/test_student(\\/.*)?$`,
      `([\\w\\d]+\\.)?canvas\\.kth\\.se\\/courses${rCfgArr[limit]}\\/enrollment_invitation$`,
      '([\\w\\d]+\\.)?canvas\\.kth\\.se\\/login(.*?)$',
      '([\\w\\d]+\\.)?kth\\.mobius\\.cloud(\\/.*)?$',
      '([\\w\\d]+\\.)?login\\.sys\\.kth\\.se(.*?)$',
      '([\\w\\d]+\\.)?login\\.ug\\.kth\\.se(.*?)$',
      '([\\w\\d]+\\.)?saml-5\\.sys\\.kth\\.se(.*?)$',
      '([\\w\\d]+\\.)?saml-5\\.ug\\.kth\\.se(.*?)$',
      '([\\w\\d]+\\.)?sso\\.canvaslms\\.com\\/delegated_auth_pass_through\\?target=(.*)$',
      '([\\w\\d]+\\.)?canvas\\.kth\\.se\\/logout(.*?)$',
      '([\\w\\d]+\\.)?canvas\\.kth\\.se\\/login\\/canvas(.*?)$',
      '([\\w\\d]+\\.)?canvas\\.kth\\.se\\/\\?login_success=(.*?)$'
  ]

  const stencilRuleObj = {
    type: 'element',
    name: 'dict',
    elements: [
      { type: 'element', name: 'key', elements: [{ type: 'text', text: 'active' }] },
      { type: 'element', name: 'true', elements: [] },
      { type: 'element', name: 'key', elements: [{ type: 'text', text: 'regex' }] },
      { type: 'element', name: 'true', elements: [] },
      { type: 'element', name: 'key', elements: [{ type: 'text', text: 'expression' }] },
      { type: 'element', name: 'string', elements: [{ type: 'text', text: '' }] },
      { type: 'element', name: 'key', elements: [{ type: 'text', text: 'action' }] },
      { type: 'element', name: 'integer', elements: [{ type: 'text', text: '1' }] }
    ]
  }
  sebConfig.elements[1].elements[0].elements[3].elements[0].text = `https://kth.se/${sCfgArr[limit]}`// starturl
  sebConfig.elements[1].elements[0].elements[237].elements = [] // purge existing rules

  for (let i = 0; i < regexArr.length; i++) {
    const rule = JSON.parse(JSON.stringify(stencilRuleObj))
    rule.elements[5].elements[0].text = regexArr[i]
    sebConfig.elements[1].elements[0].elements[237].elements.push(rule)
  }

  for (let i = 0; i < sebConfig.elements[1].elements[0].elements[237].elements.length; i++) {
    ruleArr.push(sebConfig.elements[1].elements[0].elements[237].elements[i].elements[5].elements[0].text)
    ruleString = ruleArr.join(';')
  }

  sebConfig.elements[1].elements[0].elements[245].elements[0].text = ruleString

  return (sebConfig)
}

module.exports = { generateSEBConfig }
