const crypto = require('crypto')

const HASH = 'sha256'

Buffer.prototype.base64 = function () {
  return this.toString('base64')
}

String.prototype.base64 = function (o) {
  return Buffer.from(o, 'base64')
}
Buffer.prototype.hex = function () {
  return this.toString('hex')
}

String.prototype.hex = function (o) {
  return Buffer.from(o, 'hex')
}
class Crypto {
  constructor(seed) {}
  encrypt(plain) {
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
  decrypt(encrypted) {
    const plain = crypto.privateDecrypt(
      {
        key: this.skey,
        // padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oeapHash: HASH,
      },
      typeof encrypted === 'string' ? encrypted.base64 : encrypted
      // Buffer.from(encrypted, 'base64')
    )
    return plain.toString('utf-8')
  }
  encrypt2(plain) {
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
  decrypt2(encrypted) {
    const plain = crypto.publicDecrypt(
      {
        key: this.pkey,
        // padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        oeapHash: HASH,
      },
      typeof encrypted === 'string' ? encrypted.base64 : encrypted
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
      typeof encrypted === 'string' ? signature.base64() : signature
    )
    return ret
  }
  generateKeypair() {
    return new Promise((resolve, reject) => {
      crypto.create
      crypto.generateKeyPair(
        // 'x25519',
        'ed25519',
        // 'rsa',
        {
          modulusLength: 2048,
        },
        (err, pkey, skey) => {
          if (err) reject(err)
          else {
            this.pkey = pkey
            this.skey = skey
            resolve({
              pkey: pkey.export({ type: 'spki', format: 'der' }).base64(),
              skey: skey.export({ type: 'pkcs8', format: 'der' }).base64(),
            })
          }
        }
      )
    })
  }

  generateShareKey() {
    this.sharekey = crypto.createECDH('secp521r1')
    return this.sharekey.generateKeys('base64')
  }

  computeShareKey(otherkey) {
    const r = this.sharekey.computeSecret(otherkey, 'base64')
    return r
  }

  scrypt(plain, key) {
    return crypto.scrypt()
  }
}

const test = async () => {
  const c = new Crypto()

  const r = await c.generateKeypair('hello')
  console.log(r)
  // const e = c.encrypt('hello')
  // console.log('e', e.base64())
  // const d = c.decrypt(e)
  // console.log('d', d)
  // const e2 = c.encrypt2('hello')
  // console.log('e2', e2.base64())
  // const d2 = c.decrypt2(e2)
  // console.log('d2', d2)
  const s = c.sign('hello')
  console.log('s', s.base64())
  const v = c.verify('hello', s)
  console.log('v', v)

  const alice = new Crypto()
  const bob = new Crypto()
  const akey = alice.generateShareKey()
  const bkey = bob.generateShareKey()
  console.log(
    `${alice.computeShareKey(bkey).hex()}\n${bob.computeShareKey(akey).hex()}`
  )
}

test()

const d = new Date('2021-08-13T00:00:00+09:00')
console.log(d, d.getTime())
