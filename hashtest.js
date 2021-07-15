const crypto = require('crypto')
const { v4: uuid } = require('uuid')
const encode = (seed) =>
  crypto.createHash('sha256').update(seed).digest('hex').toUpperCase()

const randstr = () => uuid().replace(/-/g, '').toUpperCase()

console.log(encode('123'), ' - ', randstr())
