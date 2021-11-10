const io = require('socket.io-client')

const socket = io('ws://localhost:3001/farm', {
  reconnectionDelayMax: 10000,
  reconnect: true,
  path: '/',
  //   auth: {
  //     token: '123',
  //   },
  //   query: {
  //     'my-key': 'my-value',
  //   },
})

const test = async () => {
  try {
    socket.on('connect', (s) => {
      console.log('connected ', s)
    })
    socket.on('disconnect', (s) => {
      console.log('disconnected ', s)
    })
  } catch (e) {
    console.error(e)
  }
}

test()
