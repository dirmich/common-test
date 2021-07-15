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

// console.log(pad(123, 5))

const m = moment()
console.log(m.day())
console.log(m.weekday())
console.log(m.isoWeekday())
