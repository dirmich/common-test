import { Ed25519KeyPair, driver as edriver } from '@transmute/did-key-ed25519'
import { X25519KeyPair, driver as xdriver } from '@transmute/did-key-x25519'
import crypto from 'crypto'
import { Ed25519Signature2018 } from '@transmute/ed25519-signature-2018'
import { ld as vc } from '@transmute/vc.js'
import {
  documentLoaderFactory,
  contexts,
} from '@transmute/jsonld-document-loader'

const documentLoader = (driver) => {
  return documentLoaderFactory.pluginFactory
    .build({
      contexts: {
        ...contexts.W3C_Decentralized_Identifiers,
        ...contexts.W3C_Verifiable_Credentials,
        ...contexts.W3ID_Security_Vocabulary,
      },
    })
    .addResolver({
      'did:key:z6': {
        resolve: async (uri) => {
          const { didDocument } = await driver.resolve(uri, {
            accept: 'application/did+ld+json',
          })
          return didDocument
        },
      },
    })
    .buildDocumentLoader()
}

export const usekeypair = async (keypair, driver) => {
  const key = await keypair.generate({
    secureRandom: () => {
      return crypto.randomBytes(32)
    },
  })
  key.id = key.controller + key.id

  const doc = documentLoader(driver)
  const verifiableCredential = await vc.issue({
    credential: {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      id: 'https://example.com/123',
      type: ['VerifiableCredential'],
      issuer: {
        id: key.controller,
      },
      issuanceDate: '2020-03-10T04:24:12.164Z',
      expirationDate: '2029-03-10T04:24:12.164Z',
      credentialSubject: {
        id: 'did:example:123',
      },
    },
    suite: new Ed25519Signature2018({
      key,
    }),
    documentLoader: doc,
  })

  const result = await vc.verifyCredential({
    credential: verifiableCredential,
    suite: new Ed25519Signature2018(),
    documentLoader: doc,
  })

  return {
    json: key.toJsonWebKeyPair(true),
    ld: key.toKeyPair(true),
    verified: result.verified,
    verifiableCredential,
  }
}

usekeypair(Ed25519KeyPair, edriver).then((r) => console.log('ed25519', r))
usekeypair(X25519KeyPair, xdriver).then((r) => console.log('x25519', r))
