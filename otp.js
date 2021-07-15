const JsSHA = require('jssha')

function randomString(length = 30) {
  const ref = '234567ABCDEFGHIJKLMNOPQRSTUVWXYZ' //base32
  return [...Array(length)]
    .map((i) => ref.charAt([parseInt(Math.random() * ref.length)]))
    .join('')
}

function hex2dec(s) {
  return parseInt(s, 16)
}

function dec2hex(s) {
  return (s < 15.5 ? '0' : '') + Math.round(s).toString(16)
}

function base32tohex(base32) {
  let base32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
    bits = '',
    hex = ''

  for (let i = 0; i < base32.length; i++) {
    let val = base32chars.indexOf(base32.charAt(i).toUpperCase())
    bits += leftpad(val.toString(2), 5, '0')
  }

  for (let i = 0; i + 4 <= bits.length; i += 4) {
    let chunk = bits.substr(i, 4)
    hex = hex + parseInt(chunk, 2).toString(16)
  }
  return hex
}

function leftpad(str, len, pad) {
  if (len + 1 >= str.length) {
    str = Array(len + 1 - str.length).join(pad) + str
  }
  return str
}

const defaultOtp = {
  issuer: 'HighmaruAuth',
  name: '',
  digits: 6,
  secret: '',
  initialTime: 0,
  period: 30,
  algorithm: 'SHA-1',
}
class OTP {
  constructor(opt) {
    this.option = { ...defaultOtp, ...opt }
    // console.log(this.option)
  }

  static parse(url) {
    const opt = {}
    const item = /^otpauth:\/\/[t|h]otp\/([^:]*)[:]?([^\?]*)\?([\s|\S]+)$/.exec(
      url
    )
    if (!item) return null
    if (item[2].length === 0) {
      if (item[1].indexOf('(') >= 0) {
        const tmp = /([^\(].*)\(([^)].*)\)/.exec(item[1])
        opt.issuer = tmp[1]
        opt.name = tmp[2]
      } else opt.name = item[1]
    } else {
      opt.issuer = item[1]
      opt.name = item[2]
    }
    const params = {}
    const tmp = item[3].split('&').map((i) => {
      const t = i.split('=')
      params[t[0]] = t[1]
    })
    if (params.secret) {
      opt.secret = params.secret
      opt.keySize = opt.secret.length * 8
    }
    if (params.digits) opt.digits = params.digits

    return new OTP(opt)
  }
  getUrl(hotp = false) {
    return `otpauth://${hotp ? 'hotp' : 'totp'}/${this.option.issuer}:${
      this.option.name
    }?secret=${this.option.secret}`
  }
  hotp(counter) {
    const key = base32tohex(this.option.secret)
    const time = leftpad(dec2hex(Math.floor(counter)), 16, '0')
    const hash = new JsSHA(this.option.algorithm, 'HEX')
    hash.setHMACKey(key, 'HEX')
    hash.update(time)
    const hmac = hash.getHMAC('HEX')
    const offset = hex2dec(hmac.substring(hmac.length - 1))
    const ret = (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec('7fffffff')) + ''
    return ret.substr(ret.length - this.option.digits, this.option.digits)
  }
  totp() {
    const counter = Math.floor(
      (Date.now() / 1000 - this.option.initialTime) / this.option.period
    )
    return this.hotp(counter)
  }
}

// // console.log(randomString(12))
// console.log(
//   OTP.parse(
//     'otpauth://totp/BitMEX:dirmich@gmail.com?secret=E2MJ3E2F754JMYMK&issuer=BitMEX'
//   ).totp()
// )
// console.log(
//   OTP.parse(
//     'otpauth://totp/Bitsonic(dirmich@gmail.com)?secret=YQHNWTZPSBE36SMD'
//   ).totp()
// )

// const otp = new OTP({ secret: randomString(16), algorithm: 'SHA-256' })

// console.log(otp.totp())

const seed = '3JQIY76L63DVUSPQ' // randomString(16)
const otp1 = () => {
  const key = base32tohex(seed)
  const time = leftpad(dec2hex(Math.floor(100)), 16, '0')
  const hash = new JsSHA('SHA-1', 'HEX')
  hash.setHMACKey(key, 'HEX')
  hash.update(time)
  const hmac = hash.getHMAC('HEX')
  const offset = hex2dec(hmac.substring(hmac.length - 1))
  const ret = (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec('7fffffff')) + ''
  return ret.substr(ret.length - 6, 6)
}

const { createHmac } = require('crypto')

const otp2 = () => {
  const key = base32tohex(seed)
  const time = leftpad(dec2hex(Math.floor(100)), 16, '0')
  const hash = createHmac(
    'sha1',
    new Uint8Array(key.match(/[\da-f]{2}/gi).map((i) => parseInt(i, 16)))
  )
  hash.update(time, 'hex')
  const hmac = hash.digest('hex')
  const offset = hex2dec(hmac.substring(hmac.length - 1))
  const ret = (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec('7fffffff')) + ''
  return ret.substr(ret.length - 6, 6)
}

console.log(otp1(), otp2())
