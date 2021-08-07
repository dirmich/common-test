const jwt = require('jsonwebtoken')
// const key = require('./key/key.json')

// const opt = {
//   algorithm: 'RS256',
//   keyid: '1',
//   noTimestamp: false,
// }

// const s = jwt.sign({ id: 'hello' }, key.privateKey, {
//   audience: 'myaud',
//   issuer: 'myissuer',
//   jwtid: '1',
//   subject: 'user',
// })
// console.log('s:', s)
// const t =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjEifQ.eyJpZCI6MSwiaWF0IjoxNjAwNDIxOTczLCJhdWQiOiJteWF1ZCIsImlzcyI6Im15aXNzdWVyIiwic3ViIjoidXNlciIsImp0aSI6IjEifQ.cIV-VB7RkyEE1DWM5zIj198sS71xBMmiz75kDjRQbjE'
// const v = jwt.verify(t, key.privateKey, {
//   audience: 'myaud',
//   issuer: 'myissuer',
// })

// console.log('v:', v)

const defaultOpt = {
  key: '!LKJLJADFJ@#KJKLF',
  expireIn: '12h', // 60000, //60, "2 days", "10h", "7d"
  issuer: 'auth.highmaru.com',
  algorithm: 'HS256',
  noTimestamp: false,
}

class TokenManager {
  constructor(opt, skey, pkey) {
    this.skey = skey
    this.pkey = pkey ? pkey : skey
    this.opt = {
      expiresIn: '12h', // 60000, //60, "2 days", "10h", "7d"
      algorithm: 'HS256',
      noTimestamp: true,
      ...opt,
    }
    this.verifier = {
      issuer: 'auth.highmaru.com',
    }
  }

  sign(obj) {
    return jwt.sign(obj, this.skey, { ...this.opt, ...this.verifier })
    // return jwt.sign((typeof obj === 'string')?obj:JSON.stringify(obj),this.skey,this.opt)
  }

  verify(token) {
    try {
      return jwt.verify(token, this.pkey, this.verifier)
    } catch (e) {
      console.error(e)
      return null
    }
  }
  decode(token) {
    try {
      return jwt.decode(token, { complete: true })
    } catch (e) {
      console.error(e)
      return null
    }
  }
}

const tm = new TokenManager({ expiresIn: '1s' }, 'hello')
let token = tm.sign({ a: 1, b: 2 })
console.log('token', token)
let r = tm.verify(token)
console.log('result', r)
let d = tm.decode(token)
console.log('decoded', d)

module.exports = { TokenManager }
