const moment = require('moment')

const url = 'https://dev.nimble-kona.com/movies/movie_1_1.mp4'

function mini(u) {
  const idx = u.lastIndexOf('/')
  return u.substr(0, idx) + '/mini' + u.substr(idx)
}
// console.log(mini(url))
function getTime(time) {
  const buf = time.split(':')
  return parseInt(buf[0]) * 60 + parseInt(buf[1])
}
// console.log('09:00'.split(':'), getTime('09:59'), getTime('10:00'))

const email = 'jessica@shuttleb.com'
const suffix = '@shuttleb.com'

function validateEmail(str) {
  let idx = str.indexOf(suffix)
  if (idx >= 0) return str
  else {
    idx = str.indexOf('@')
    if (idx >= 0) return str
    else {
      return str + suffix
    }
  }
}
// console.log(validateEmail(email))
// console.log(validateEmail('email@g'))

function checkSuffix(str, sf) {
  let idx = str.indexOf(sf)
  console.log(idx, str.length, sf.length, str.length - sf.length)
  return idx >= 0
    ? str.length - sf.length === idx
      ? str.substr(0, idx)
      : str
    : str
}

// console.log(checkSuffix('jessica@shuttleb.com1', suffix))

function pad(str, padlen = 2, fillchar = '0') {
  return (new Array(padlen + 1).join(fillchar) + str).slice(-padlen)
}

function wsUrlParseFn(u2) {
  const ut = /^(.*:\/\/)(.*)/
  console.log('S]parse0', u2)
  if (!ut.test(u2)) {
    u2 = `https://${u2}`
  }
  console.log('S]parse1', u2)
  let url = new URL(u2)
  console.log('S]parse2', url)
  const srcProto = url.protocol.toLowerCase()
  console.log('S]parse3', srcProto)
  if (srcProto !== 'https:' && srcProto !== 'http') {
    u2 = u2.replace(/^(.*:\/\/)(.*)/gm, '$2')
    url = new URL(`http://${u2}`)
  }
  console.log('S]parse4', u2, url)
}

// console.log(wsUrlParseFn('highmaru.com:4222'))
// // console.log(pad(123, 5))

// // const m = moment()
// // console.log(m.day())
// // console.log(m.weekday())
// // console.log(m.isoWeekday())

const t = new Date().getTime()
const t2 = moment(new Date(t)).format('LT')
console.log(t, t2)
