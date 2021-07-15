const crypto = require('crypto')

class Crypto {
  constructor() {}
  generateKeypair() {
    return new Promise((resolve, reject) => {
      crypto.generateKeyPair('rsa', {
        modulusLength: 4096,
      })
    })
  }
}
