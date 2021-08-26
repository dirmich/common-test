const moment = require('moment')

const now = moment()
console.log(
  now.toDate(),
  //   now.subtract(1, 'month').toDate(),
  now.add(1.5, 'year').format('YYYY.MM.DD HH:mm:ss')
)
