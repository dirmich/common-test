const util = require('eth-sig-util')
const kek = require('keccak256')

const msg = 'Login honeyweb'
const msg2 = Buffer.from(msg, 'utf-8').toString('hex')
const sig =
  '0xfb38cf4ccb79fe23938a32d5e6655263e5477999cfb2d3a9ca8d9009f5f3b57a43614565e5781d353c123826fb2727e0eec7d87fcba770bac995eec0751104d61b'
const account = '0x027042dbadfb1bca726fdb037b04f938bf735b32'

const r = util.recoverPersonalSignature({ data: msg, sig })
// const r = util.signTypedData(msg, account)
// const r = kek()
console.log(r)
