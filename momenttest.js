// const moment = require('moment')
import moment from 'moment'
import moment_tz from 'moment-timezone'

const now = moment()
const tz = moment_tz.tz.guess(true)
console.log(
  now.toDate(),
  //   now.subtract(1, 'month').toDate(),
  now.add(1.5, 'year').format('YYYY.MM.DD HH:mm:ss'),
  tz
)

// moment_tz.tz.names().map((t) => console.log(t))
// console.log(moment_tz.tz('Asia/Seoul').format('YYYY-MM-DD HH:mm ZZ'))
// console.log(moment_tz.tz.zonesForCountry('KR', true))

const from = moment([1971, 3, 1])
const to = moment()
console.log(to.diff(from, 'days') + 1)
