const slip39 = require('slip39')
const assert = require('assert')
// threshold (N) number of group shares required to reconstruct the master secret.
const threshold = 2
const masterSecret =
  'FYmoFw55GeQH7SRFa37dkx1d2dZ3zUF8ckg7wmL7ofN4'.slip39EncodeHex()
const passphrase = 'TREZOR'

/**
 * 4 groups shares.
 * = two for Alice
 * = one for friends and
 * = one for family members
 * Two of these group shares are required to reconstruct the master secret.
 */
const groups = [
  // Alice group shares. 1 is enough to reconstruct a group share,
  // therefore she needs at least two group shares to be reconstructed,
  [1, 1],
  [1, 1],
  // 3 of 5 Friends' shares are required to reconstruct this group share
  [3, 5],
  // 2 of 6 Family's shares are required to reconstruct this group share
  [2, 6],
]

const slip = slip39.fromArray(masterSecret, {
  passphrase: passphrase,
  threshold: threshold,
  groups: groups,
})
console.log(slip)

// One of Alice's share
const aliceShare = slip.fromPath('r/0').mnemonics
console.log('aliceShare', slip.fromPath('r/1').mnemonics)
console.log('1]', slip.fromPath('r/3/1').mnemonics)
console.log('2]', slip.fromPath('r/3/3').mnemonics)
// and any two of family's shares.
const familyShares = slip
  .fromPath('r/3/1')
  .mnemonics.concat(slip.fromPath('r/3/3').mnemonics)
const allShares = aliceShare.concat(familyShares)

console.log('Shares used for restoring the master secret:')
allShares.forEach((s) => console.log(s))

const recoveredSecret = slip39.recoverSecret(allShares, passphrase)
console.log('Master secret: ' + masterSecret.slip39DecodeHex())
console.log('Recovered one: ' + recoveredSecret.slip39DecodeHex())
assert(masterSecret.slip39DecodeHex() === recoveredSecret.slip39DecodeHex())
