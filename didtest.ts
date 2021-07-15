// // const { TokenManager } = require('./jwttest')
// // const fs = require('fs')
// // const skey = fs.readFileSync('./skey.pem')
// // const pkey = fs.readFileSync('./pkey.pem')

// // try {
// //   const man = new TokenManager({ algorithm: 'RS256' }, skey, pkey)

// //   const t = man.sign({ alg: 'RS256', kid: 'testkey' })
// //   console.log('S', t)
// //   const r = man.verify(t)
// //   console.log('R:', r)
// //   console.log('end test')
// // } catch (e) {
// //   console.log(e)
// // }

// import { factory, DidDocument } from '@did-core/data-model'
// import { representation as ra } from '@did-core/did-ld-json'
// import { representation as rb } from '@did-core/did-json'
// import { representation as rc } from '@did-core/did-dag-cbor'

// const makeDocument = async (
//   doc: DidDocument,
//   type: string,
//   representer: any
// ) => {
//   const res: Buffer = await doc
//     .addRepresentation({ [type]: representer })
//     .produce(type)
//   console.log(type, res.toString())
// }

// const makeDocument2 = async (doc: DidDocument, type: string) => {
//   const res: Buffer = await doc.produce(type)
//   console.log(type, res.toString())
// }

// const test = async () => {
//   const didDocument: DidDocument = factory.build({
//     entries: {
//       '@context': 'https://www.w3.org/ns/did/v1',
//       id: 'did:example:123',
//     },
//   })
//   didDocument.addRepresentation({ 'application/did+ld+json': ra })
//   didDocument.addRepresentation({ 'application/did+json': rb })
//   didDocument.addRepresentation({ 'application/did+dag+cbor': rc })
//   //  await makeDocument(didDocument, 'application/did+ld+json', ra)
//   //  await makeDocument(didDocument, 'application/did+json', rb)
//   //  await makeDocument(didDocument, 'application/did+dag+cbor', rc)
//   await makeDocument2(didDocument, 'application/did+ld+json')
//   await makeDocument2(didDocument, 'application/did+json')
//   await makeDocument2(didDocument, 'application/did+dag+cbor')
// }

// test()
