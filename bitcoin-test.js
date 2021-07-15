const bc = require('bitcoinjs-lib')
const axios = require('axios')

// const getPrices = async () => {
//   const url = 'https://blockchain.info/ticker?currency=MXN'
//   try {
//     return await axios.get(url)
//   } catch (e) {
//     throw new Error(e)
//   }
// }

// getPrices().then((r) => console.log(r.data))

const keypair = bc.ECPair.makeRandom()
bc.Psbt
const { address } = bc.payments.p2pkh({ pubkey: keypair.publicKey })
const hash = bc.crypto.hash256(Buffer.from('hello'))
const sig = keypair.sign(hash)
const verify = keypair.verify(hash, sig)
const pkey = keypair.publicKey.toString('hex')
const skey = keypair.toWIF()
// const dp = bc.ECPair.fromPrivateKey(keypair.privateKey.toString)
// const ds = bc.ECPair.fromPublicKey(keypair.publicKey)
// const dw = bc.ECPair.fromWIF(skey)
const dw = bc.ECPair.fromPublicKey(Buffer.from(pkey, 'hex'))
// const sig2 = dw.sign(hash)
const v2 = dw.verify(hash, sig)
const { address2 } = bc.payments.p2pkh({ pubkey: dw.publicKey })
console.log({
  address,
  address2,
  pkey,
  skey,
  //   dp,
  //   ds,
  dw,
  keypair,
  hash,
  sig,
  verify,
  //   sig2,
  v2,
  //   ss: dw.toWIF(),
  st: dw.privateKey,
})
