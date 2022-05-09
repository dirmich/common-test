const EtherWallet = require('node-ethereum-wallet')

let w = new EtherWallet()

w.init()
let skey = w.dumpPrivKey('0x9b4eF34934fE70dC84e502a78C47fd4564d7D6F0')
console.log(skey)
