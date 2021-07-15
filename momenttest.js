const moment = require('moment')

const now = moment()
console.log(now.toDate(), now.subtract(1, 'month').toDate())
