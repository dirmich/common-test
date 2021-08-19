const NodeRSA = require('node-rsa')

const publicKey =
  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAj8eLETg1+rjjodFxi82Svobb39pImc/B+JWLq3uQMcDFU444oyVDKIrB5haJHHcVSN10VMQ9HgZSYj8PU1NyEUfNH/nLWXs+BDsalIJuFQc3DRtfqUDiumWsJu7adGZlnQkOOByTHfNka+rSAL0I3Eau9M+fyk3tJDBgmsf4x0F9emc7EtIEWnZWC82AaeMfJYJNMEgJcjRSRq0Idj2bdHr9HM3jnagWLkdmFEGsOqUHkGq/XBGePjDlc4naJkBFGKTSJejPSKYEILHwnNTHQw+tcxW1FHXwBHR2zcwI/yVi6pP8DBpIXCwWYNmTGnLJ5wiArvDPrQdlmvfC3iurRwIDAQAB'
const payload = 'some test payload'
const signature =
  'Ck1hen0veKkNV7A9BhpfjVi/28PldgaPk+NM43de67PkszBYERKWNCVGcTU9dND0MGe3mQf4ut7yZXrqWOVqvCeT0lxSCL/+V/ZIfNH3g6rsgUJZ8EBoadUThd/1pZboZ4cUPNJXykNSZ7UZZvu4LjbYy09Z1fXNuJ2L4iXt54S9AG/h3VYZmNEZ9+aGuzqAs5dHsBTiim+SOnXrn6JnEp4a0MQHloqKk8hj77sVp8d8nIVL+MjPZuv6GixDKpusSuosm0GVTQ6lwet54NewILb6C1NiYjj3Z/3BAsQFmZyhL7t+ebO2pEtGOZL5N+Tg5XtmPO1oY3edOHBE4ZGAlQ=='

const publicKeyBuffer = Buffer.from(publicKey, 'base64')
const key = new NodeRSA()
const signer = key.importKey(publicKeyBuffer, 'public-der')
const signatureVerified = signer.verify(
  Buffer.from('highmaru'),
  signature,
  'utf8',
  'base64'
)

console.log(signatureVerified)
