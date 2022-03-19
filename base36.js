const b = require('@abcnews/base-36-text')
const hex2dec = require('hex2dec')
const conv = require('hex2dec')
const bn = require('big-integer')

function ascii_to_hex(str) {
  var arr1 = []
  for (var n = 0, l = str.length; n < l; n++) {
    var hex = Number(str.charCodeAt(n)).toString(16)
    arr1.push(hex)
  }
  return arr1.join('')
}

String.prototype.toHex = function () {
  return ascii_to_hex(this)
}

String.prototype.toInt = function () {
  //   return parseInt(this, 16)
  return hex2dec.hexToDec(this)
}

String.prototype.toAscii = function () {
  return this.match(/.{1,2}/g)
    .map(function (v) {
      return String.fromCharCode(parseInt(v, 16))
    })
    .join('')
}

Number.prototype.toHex = function () {
  return this.toString(16)
}

const basetable = '0123456789abcdefghijklmnopqrstuvwxyz'
const baselen = 36

// const basetable = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
// const baselen = 58
// const basetable =
//   '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
// const baselen = 62
const bn2encode = (bignum) => {
  let val = bignum
  const ret = []
  while (val.value > 0) {
    const { quotient: q, remainder: r } = val.divmod(baselen)
    ret.push(basetable[r.value])
    val = q
  }
  return ret.reverse().join('')
}
const bn2decode = (str) => {
  return str
    .split('')
    .reverse()
    .map((v, idx) => bn(baselen).pow(idx).multiply(basetable.indexOf(v))) //  Math.pow(36, idx) * b36.indexOf(v))
    .reduce((r, e) => r.add(e), bn(0))
}

// const enc = bn('hello, world'.toHex().toInt())
// const base = bn('Hello World!'.toHex(), 16)
// const base = bn('The quick brown fox jumps over the lazy dog.'.toHex(), 16)
// const base = bn('9b4eF34934fE70dC84e502a78C47fd4564d7D6F0', 16)
const base = bn(1000)
const enc = bn2encode(base)
const dec = bn2decode(enc)
console.log(base)
console.log(base.toString(16))
console.log(enc)
console.log(bn(dec).toString(16)) //.toAscii())
