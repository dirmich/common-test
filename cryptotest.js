const crypto = require('crypto')
const { TokenManager } = require('./jwttest')

const HASH = 'sha256'

Buffer.prototype.base64 = function () {
  return this.toString('base64')
}

String.prototype.base64 = function () {
  return Buffer.from(this, 'base64')
}
Buffer.prototype.hex = function () {
  return this.toString('hex')
}

String.prototype.hex = function () {
  return Buffer.from(this, 'hex')
}
class Crypto {
  constructor(seed) {
    const opt = {
      skey: crypto.randomBytes(20),
      expiresIn: '3m',
      issuer: 'auth.highmaru.com',
      algorithm: 'HS256',
    }

    this.jwt = new TokenManager(opt)
  }
  pencrypt(plain) {
    const encrypted = crypto.publicEncrypt(
      {
        key: this.pkey,
        // padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oeapHash: HASH,
      },
      Buffer.from(plain)
    )
    return encrypted
  }
  sdecrypt(encrypted) {
    const plain = crypto.privateDecrypt(
      {
        key: this.skey,
        // padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oeapHash: HASH,
      },
      typeof encrypted === 'string' ? encrypted.hex() : encrypted
      // Buffer.from(encrypted, 'base64')
    )
    return plain.toString('utf-8')
  }
  sencrypt(plain) {
    const encrypted = crypto.privateEncrypt(
      {
        key: this.skey,
        // padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        oeapHash: HASH,
      },
      Buffer.from(plain)
    )
    return encrypted
  }
  pdecrypt(encrypted) {
    const plain = crypto.publicDecrypt(
      {
        key: this.pkey,
        // padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        oeapHash: HASH,
      },
      typeof encrypted === 'string' ? encrypted.hex() : encrypted
      // Buffer.from(encrypted, 'base64')
    )
    return plain.toString('utf-8')
  }
  sign(data) {
    const signature = crypto.sign(
      // HASH,
      null,
      typeof data === 'string' ? Buffer.from(data) : data,
      {
        key: this.skey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
      }
    )
    return signature
  }
  verify(data, signature) {
    const ret = crypto.verify(
      // HASH,
      null,
      Buffer.from(data),
      {
        key: this.pkey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
      },
      typeof signature === 'string' ? signature.hex() : signature
    )
    return ret
  }
  generateKeypair(algo = 'rsa') {
    return new Promise((resolve, reject) => {
      crypto.generateKeyPair(
        // 'x25519',
        // 'ed25519',
        // 'rsa',
        algo,
        {
          modulusLength: 2048,
          // publicKeyEncoding: {
          //   type: 'spki',
          //   format: 'der',
          // },
          // privateKeyEncoding: {
          //   type: 'pkcs8',
          //   format: 'der',
          // },
        },
        (err, pkey, skey) => {
          if (err) reject(err)
          else {
            this.pkey = pkey
            this.skey = skey
            resolve({
              pkey: pkey.export({ type: 'spki', format: 'der' }).hex(),
              skey: skey.export({ type: 'pkcs8', format: 'der' }).hex(),
            })
          }
        }
      )
    })
  }

  generateShareKey() {
    this.sharekey = crypto.createECDH('secp256k1')
    return this.sharekey.generateKeys('hex')
  }
  initShareKey(skey) {
    this.sharekey = crypto.createECDH('secp256k1')
    this.sharekey.setPrivateKey(skey, 'hex')
  }

  computeShareKey(otherkey) {
    return this.sharekey.computeSecret(otherkey, 'hex')
  }

  encrypt(plain, key) {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
    const enc = Buffer.concat([
      cipher.update(typeof plain === 'string' ? plain : JSON.stringify(plain)),
      cipher.final(),
    ])
    const auth = cipher.getAuthTag()
    return auth.hex() + iv.hex() + enc.hex()
  }
  decrypt(enctext, key) {
    const auth = enctext.substr(0, 32).hex()
    const iv = enctext.substr(32, 32).hex()
    const enc = enctext.substr(64).hex()
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
    decipher.setAuthTag(auth)
    const plain = Buffer.concat([decipher.update(enc), decipher.final()])
    return plain.toString()
  }
  generate64(seed) {
    let ret = crypto.createHash('sha512').update(seed).digest('hex')
    let key = ret.substring(0, ret.length / 2)
    let did = ret.substring(ret.length / 2)
    return { key, did }
  }
  share_init() {
    const k = this.sharekey
      ? this.sharekey.generateKeys('hex')
      : this.generateShareKey()
    const sk = this.sharekey.getPrivateKey('hex')
    const token = this.jwt.sign({ seed: sk })
    return { token, data: k }
  }

  share_update({ token, data }, seed = 'hello, this is a sample') {
    if (!token || !data) return null
    const k = this.sharekey
      ? this.sharekey.generateKeys('hex')
      : this.generateShareKey()
    const ck = this.computeShareKey(data)
    const key = this.generate64(seed)
    const calc = this.encrypt(key, ck)
    return { token, seed: k, data: calc }
  }

  share_final({ token, data, seed }) {
    const { seed: sk } = this.jwt.verify(token)
    console.log(token, data, seed)
    this.initShareKey(sk)
    const ck = this.computeShareKey(seed)

    const d = this.decrypt(data, ck)
    try {
      const p = JSON.parse(d)
      return p
    } catch (e) {
      return d
    }
  }
}

const test = async () => {
  const c = new Crypto()
  console.log('---START')
  const r = await c.generateKeypair() //'ed25519')
  console.log(r)
  const e = c.sencrypt('hello')
  console.log('e', e.hex())
  const d = c.pdecrypt(e)
  console.log('d', d)
  const e2 = c.pencrypt('hello')
  console.log('e2', e2.hex())
  const d2 = c.sdecrypt(e2)
  console.log('d2', d2)
  const s = c.sign('hello')
  console.log('s', s.hex())
  const v = c.verify('hello', s)
  console.log('v', v)

  const alice = new Crypto()
  const bob = new Crypto()
  const akey = alice.generateShareKey()
  const bkey = bob.generateShareKey()
  console.log(
    `${alice.computeShareKey(bkey).hex()}\n${bob.computeShareKey(akey).hex()}`
  )
  const ackey = alice.computeShareKey(bkey)
  const bckey = bob.computeShareKey(akey)
  const ee = c.encrypt({ a: 1 }, ackey)
  console.log('e', ee)
  const dd = c.decrypt(ee, bckey)
  console.log('d', dd)
  console.log(c.generate64('hello'))
  console.log(c.generate64('hello'))
}

const zero = async () => {
  const jwt = {
    skey: '!LKJLJADFJ@#KJKLF',
    expiresIn: '1y',
    issuer: 'auth.highmaru.com',
    algorithm: 'HS256',
  }
  const t = new TokenManager(jwt)
  const c = new Crypto()
  const k = await c.generateShareKey()
  const sk = c.sharekey.getPrivateKey('hex')
  const msg = await t.sign({ seed: sk + k }, { expiresIn: '5m' })
  console.log('--ZERO')
  console.log(sk.length, sk)
  return msg
}

const test2 = async (token, data) => {
  // const jwt = {
  //   skey: '!LKJLJADFJ@#KJKLF',
  //   expiresIn: '1y',
  //   issuer: 'auth.highmaru.com',
  //   algorithm: 'HS256',
  // }
  // const t = new TokenManager(jwt)
  // const { seed: gen } = t.verify(seed)
  // const a = gen.substring(0, 64)
  // const b = gen.substring(64)
  const c = new Crypto()
  const k = await c.generateShareKey()
  const ck = c.computeShareKey(data)

  // const p = c.generate64('hello')
  // const e = t.sign(p)
  console.log('---COMPUTE')
  console.log(ck.hex(), ck.length)
  console.log(k, k.length)
  const key = c.generate64('hello, this is a sample')
  const calc = c.encrypt(key, ck)
  return { token, seed: k, data: calc }
  // const msg = await t.sign({ seed: a + k, data }, { expiresIn: '5m' })
  // return msg

  // const pk = c.sharekey.getPublicKey('hex')
  // c.sharekey.
  // console.log('keys', pk, sk)
  // const d = new Crypto()
  // d.initShareKey(sk)
  // const pk2 = c.sharekey.getPublicKey('hex')
  // const sk2 = c.sharekey.getPrivateKey('hex')
  // console.log('keys', pk2, sk2, pk2.length, sk2.length)
}

const test3 = async ({ token, seed, data: encdata }) => {
  const jwt = {
    skey: '!LKJLJADFJ@#KJKLF',
    expiresIn: '1y',
    issuer: 'auth.highmaru.com',
    algorithm: 'HS256',
  }
  const t = new TokenManager(jwt)
  const { seed: sk } = t.verify(token)
  // const a = gen.substring(0, 64)
  // const b = gen.substring(64)
  const c = new Crypto()
  const k = await c.initShareKey(sk)
  const ck = c.computeShareKey(seed)

  const d = c.decrypt(encdata, ck)
  // const p = c.generate64('hello')
  // const e = t.sign(p)
  console.log('---COMPUTE')
  console.log(ck.hex(), ck.length)
  console.log('dec', d)
}
// test()
const t = async () => {
  // const a = await zero()
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZWVkIjoiMjJiNzI3YmViZmNiYWQ4YjkzNzdjMjE3ZGNiMzE0YjMxMWEwNmNmZTMxNzM1MTUxNDBmN2IyMGE2NTY5NTM0ZSIsImV4cCI6MTYyOTk1NzM0OCwiaXNzIjoiYXV0aC5oaWdobWFydS5jb20ifQ.7rwAAQ_vBwCtvlGInAJoLycV4I97GU1t2Cn6Np5oaMg'
  const data =
    '0477c072a2436c5ab8ac36959a819bf606371ed15ce19189a771c1fb3308a4b6bf854a7a1aab9f05638b9f9170e483497e607bfc18758768bfd7d674d6d3a6aa75'
  const b = await test2(token, data)
  console.log('-->', b)
  const c = await test3(b)
}
// t()

const total = async (from_server) => {
  // const alice = new Crypto()
  const bob = new Crypto()
  // const a = alice.share_init()
  const b = bob.share_update(from_server)
  // const c = alice.share_final(b)

  console.log(b)
}

total({
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZWVkIjoiMDljYmQ0YmJhY2FlY2YxNmVhYThmOGMyNjVlNTUwOTdjN2FmOWVmYmM3MGQ4NDgxNzBmMjY3YzNjM2MyNDA5MiIsImV4cCI6MTY2MTU4MzU0NiwiaXNzIjoiYXV0aC5oaWdobWFydS5jb20ifQ.k5JigwVJcwOE5eHSowbn7D0D3cR4uuEOcPxIZAVQgM4',
  data: '0450ddf7568722120d868a39164210371d373e41a65769d0fd8447edab7903f800305561435e99249fc6b507036e990d905c3cb565fd1adf4248238aedf95b7cd7',
})
// const k = crypto.createSecretKey(Buffer.from('1234'))
// const kp = crypto.createPrivateKey('1234')
// const ks = crypto.createPublicKey('1234')
// console.log(k.hex(), kp.hex(), ks.hex())

// const d = new Date('2021-08-13T00:00:00+09:00')
// console.log(d, d.getTime())
