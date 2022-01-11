const { connect, StringCodec, JSONCodec } = require('nats')
const sc = StringCodec()

const test = async () => {
  // to create a connection to a nats-server:
  const nc = await connect({ servers: 'highmaru.com:4222' })
  console.log('connected')
  // create a codec
  // create a simple subscriber and iterate over messages
  // matching the subscription
  //   setInterval(() => {
  //     nc.publish('hello', sc.encode('world'))
  //     nc.publish('hello', sc.encode('again'))
  //   }, 2000)

  const sub = nc.subscribe('hello')
  for await (const m of sub) {
    console.log(`[${sub.getProcessed()}]: ${sc.decode(m.data)}`)
    // setTimeout(() => {
    //   await nc
    // }, 5000)
  }

  console.log('subscription closed')

  // we want to insure that messages that are in flight
  // get processed, so we are going to drain the
  // connection. Drain is the same as close, but makes
  // sure that all messages in flight get seen
  // by the iterator. After calling drain on the connection
  // the connection closes.
  await nc.drain()
}

const test2 = async (nc) => {
  nc.request(
    'calc.add',
    sc.encode(JSON.stringify({ a: 1, b: 2 }), { timeout: 3000 })
  )
    .then((m) => {
      console.log('R]', m.reply, sc.decode(m.data))
    })
    .catch((e) => {
      console.error('ERR]', e.toString())
    })
}

;(async () => {
  const nc = await connect({
    servers: 'highmaru.com:4222',
    noEcho: true,
    timeout: 1000,
  })
  console.log('connected')
  const sub = nc.subscribe('>')
  await test2(nc)
  for await (const m of sub) {
    console.log(`[${sub.getProcessed()}]: ${sc.decode(m.data)}`)
  }
  //   nc.publish('hello') //, JSONCodec().encode({ hello: 'world' }))
})()
// test()
