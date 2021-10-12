const crypto = require('crypto')
const { wordlists } = require('./mnemonic_wordlist')

const sha256 = (seed) =>
  crypto.createHash('sha256').update(Buffer.from(seed, 'hex')).digest('hex')

const normalize = (str) => (str || '').normalize('NFKD')
const pad = (str, len = 8, p = '0') =>
  (Array(len).fill(p).join('') + str).substr(str.length)
const bin2byte = (bin) => parseInt(bin, 2)
const byte2bin = (data) => pad(data.toString(2))
const bytes2bin = (data) => data.map((x) => byte2bin(x))
const checksum = (buf) =>
  bytes2bin(Array.from(crypto.createHash('sha256').update(buf).digest()))
    .join('')
    .substr(0, buf.length / 4)

const encode = (org) => {
  const data = !Buffer.isBuffer(org) ? Buffer.from(org, 'hex') : org
  if (data.length < 16 || data.length > 32 || data.length % 4 !== 0)
    throw `invalid ${data.length}`
  const bits = bytes2bin(Array.from(data)).join('') + checksum(data)
  const chunks = bits.match(/(.{1,11})/g)
  const words = chunks.map((binary) => {
    const index = bin2byte(binary)
    return wordlists[index]
  })
  return words.join(' ')
}

const decode = (list) => {
  const bits = normalize(list)
    .split(' ')
    .map((i) => {
      const idx = wordlists.indexOf(i)
      if (idx < 0) throw 'error'
      return pad(idx.toString(2), 11)
    })
    .join('')
  const idx = Math.floor(bits.length / 33) * 32
  const entropy = bits.substr(0, idx)
  const corg = bits.substr(idx)
  const data = entropy.match(/(.{1,8})/g).map(bin2byte)
  if (data.length < 16 || data.length > 32 || data.length % 4 !== 0)
    throw 'invalid'

  const output = Buffer.from(data)
  const c = checksum(output)

  if (corg !== c) throw `invalid need ${corg} --> ${c}`
  return output.toString('hex')
}

class BIP39 {
  constructor() {}
  encode(org) {
    const data = !Buffer.isBuffer(org) ? Buffer.from(org, 'hex') : org
    if (data.length < 16 || data.length > 32 || data.length % 4 !== 0)
      throw `invalid ${data.length}`
    const bits = bytes2bin(Array.from(data)).join('') + checksum(data)
    const chunks = bits.match(/(.{1,11})/g)
    const words = chunks.map((binary) => {
      const index = bin2byte(binary)
      return wordlists[index]
    })
    return words.join(' ')
  }

  decode(list) {
    const bits = normalize(list)
      .split(' ')
      .map((i) => {
        const idx = wordlists.indexOf(i)
        if (idx < 0) throw 'error'
        return pad(idx.toString(2), 11)
      })
      .join('')
    const idx = Math.floor(bits.length / 33) * 32
    const entropy = bits.substr(0, idx)
    const corg = bits.substr(idx)
    const data = entropy.match(/(.{1,8})/g).map(bin2byte)
    if (data.length < 16 || data.length > 32 || data.length % 4 !== 0)
      throw 'invalid'

    const output = Buffer.from(data)
    const c = checksum(output)

    if (corg !== c) throw `invalid need ${corg} --> ${c}`
    return output.toString('hex')
  }
}
//const org = '87b390d1a2b609a52dfee370903e80c7ef36d5d779ddb7a7513b7f06cd124afd'
const org = '063679ca1b28b5cfda9c186b367e271e'
const e = encode(org) //063679ca1b28b5cfda9c186b367e271e')
console.log(e.split(' ').length, e)
const d = decode(e)
console.log('-->', org === d, d.length, decode(e))

const bip = new BIP39()
const e1 = bip.encode(org) //063679ca1b28b5cfda9c186b367e271e')
console.log(e1.split(' ').length, e1)
const d1 = bip.decode(
  'logic garlic other hospital drop cycle crowd eagle impact initial crack come'
)
console.log('-->', org === d1, d1.length, d1)

// console.log(pad('123', 16))
