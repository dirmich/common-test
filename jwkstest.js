const fs = require('fs')
const ms = require('ms')
const jose = require('node-jose')
const { default: JwksClient } = require('jwt-jwks-client')

const keys = {
  keys: [
    {
      kty: 'RSA',
      kid: 'VjPt2i1CAgx3oCU05-ZyyDOliAx26nfWEab2wygWogw',
      use: 'sig',
      alg: 'RS256',
      e: 'AQAB',
      n: 'wEnxijNSdj8-VQ_Gnw-edNDpb2LFWODRBbjUPsxJQZGCbShYqDxMS9cNeFxHMtU-BKnwBK_fGlU00rqFnOKNKCv7FJNtwtdw1h7bxGX8hjacjWdugDvchZmHI5VtAXpdv7DOSxqWCjt8g9wEWVLfMLwRrT1Bz8HrM-NZtLaHCX-t2_06XcPc5u3ehv6UT9PPLiC9066Cerfu0KNlWT8PeIHYHpFBY0rMwwUOgRraYCBu6blzp0CIV1CchOnOSM-sMbPv4FPKAJwEd3SgEzxl2pKSB58Ydy8zsTbLWxemJ3D2LnlY3So0Y9dvBElQDnhON6GtXESQDcS0Vq5oq2XGgQ',
      d: 'MLYKpDHgH-hhh_bZIA462-jYWckxqRQ6nzJ1QftKS3vrCHACFYxA36140ha-SphOf6v1C5rp76fKG9_4XQffLmAF2O6IDaW6BeQHVDdpwy4udnvPOFjxwj5kR5Vg6dDv0tGdUNVJUQpEvrqLt30Q4S2jZLlx5ImBZcGgRfE_QB5RWjvCerJGjBoXv1LVlceQJVg6cnHE_5bBqaqnOWcJPJUcoJZMhPVm5k86v6eDlLsXd2ecVV6cIrFr8FngS-SHEuV_gMcJnmUzJHuDvmVFynYPyf0DuY-Wx0C_F5ClIyEIfe_Mg0jPfqPzaLIdHCVgOLJ08CUcooHxiSetYvsR4Q',
      p: '7viJ1TJ_xW3tDK4TcsXKzt9S2goFVOXHLCnNREsbkGXKEXu4QjsRUrz3jP6kTioh_VMAsAMehrs0HygIbqYmBrVX5V46jbXLkijcEHQola6eUKNXsVA_IywamOY1416BQFdwdVvcjwpmuSa7f68m6Y2WeeF1RD435sHPUb78vj0',
      q: 'zf3NMHT98XEJZT0zOFngcr1jtknzUz81wp1FclEeTjK5XGXszz5mQg3aa0qbwIrDAzyfWzvZcr2MXcFziydaX6SQzTHYb27iT08USUcLm2DYrlENrO7xiiN6p1WFoco6oCzzE__JhEw39vU_BYkw0iTWOWRD44w31tEFWmvdEZU',
      dp: 'w69eHukFXARSEwoQ_vEczB5v2ABQsV6fpHhukDf40FuqBnsLPaDk5J29EQYMQb2aq7hmXbuQKb_uRH0huonvpZql6TsqM5TkqEExQ3_7I-cj2OCJFLejnAenmAEbq55dtPRlMJUSnUdlKsSe0UX6VVIOIKwQvNs-J4YZYNVGXfk',
      dq: 'FdEEk1ZAsvqS0SsbKqOyNtTCI8NPRwjRy8vWWBYpTIToxtVwsD5enC5VbLmZJ1pK7yPTiNkc3Z8fp6peb2V6l9iZEXJvBtZKl7W7Y0tn-kvWhxfEiAVChaveSKyxG4KMlPxNvld_40gjQT-WLiLqjcci_S8WVZo7K8A1fe8gmcU',
      qi: 'nWoKTOxKUxRccJTjEK2MKWzi1pEX6Ja0ehHMzQA9_3JPTnyXCH6MD-fJma5IdmTyuYTXrGW3PyGJCaZvsnPxgh5hC5TpqYcLxTssX7jLiM17QGRCWlNJB712p0DCiv7gMTLyIk1RjKjYOrbt8hEOyEBcDRYZAmmlAX5zrD_0dl8',
    },
  ],
}
// const keyStore = jose.JWK.createKeyStore()

// const generate = async () => {
//   const r = await keyStore.generate('RSA', 2048, { alg: 'RS256', use: 'sig' })
//   // .then((result) => {
//   //   //   fs.writeFileSync(
//   //   //     'Keys.json',
//   //   //     JSON.stringify(keyStore.toJSON(true), null, '  ')
//   //   //   )
//   //   //   console.log(result, keyStore.toJSON(true))
//   // })
//   console.log('pkey:', keyStore.toJSON())
//   console.log('skey:', keyStore.toJSON(true))
//   return r
// }

// generate()

const token = async () => {
  //   await generate()
  const keyStore = await jose.JWK.asKeyStore(keys)
  const [key] = keyStore.all({ use: 'sig' })
  const opt = { compact: true, jwk: key, fields: { typ: 'jwt' } }

  const payload = JSON.stringify({
    exp: Math.floor((Date.now() + ms('1d')) / 1000),
    iat: Math.floor(Date.now() / 1000),
    sub: 'test',
    issuer: 'auth.lab.highmaru.com',
  })

  const token = await jose.JWS.createSign(opt, key).update(payload).final()
  console.log(token)
  return token
}

// token()
// console.log('JwksClient', new JwksClient())
const test = async () => {
  const token =
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6InRlc3QiLCJpYXQiOjE2NTQyNDY1NjQsImV4cCI6MTY4NTgwNDE2NCwiaXNzIjoiYXV0aC5oaWdobWFydS5jb20ifQ.KVFQ5C699ANjIvV3Q7i0YRk6FAPhAWvJVmNANmDds8_s8DQLt1FHibDtmD9zRx3kokVYFjwzlEfY3YZBeY4LVaChiuBkS5lojRzQAsOXgejzWmK2hukLGbOYcIulmche9ou-5_FC3Yrf3XVmRYGRt_TmXmrqTDC0vXDXKQuy2AVEHgU9AXLt-Q1wuWdj7DJJuss0swTPE-zSq7HbhR12u5vaUkyw49szcQiGjr9AGkfEvdB2qah_olFJPoNsTG3kwdOQZytkEPT3WLbNIxdoWWJoZNNexUUy0wu1GmKF1nb4WhwsvI_CVM3Kl6UWMC87zYPJazN7hXWQ6S-GVl98Xw'
  const client = new JwksClient({
    jwksUri: 'http://localhost:4200/jwks.json',
    secure: false,
    rateLimit: 0, // Optional, num of request per min, 0 means no limit
    requestHeaders: {}, // Optional
    requestAgentOptions: {}, // Optional
    timeout: 30000, // Optional, default 30s
  })
  const r = await client.verify(token)
  console.log(r)
}

test()
