const io = require('ws')

class WSClient {
  constructor(url) {
    this.url = url
  }
  connect() {
    if (this.sock) delete this.sock
    this.sock = new io(this.url)
    this.setEvents(this.sock)
  }
  setEvents(s) {
    s.on('open', () => {
      if (this.onOpen)
        this.onOpen({
          req: s._socket.remoteAddress,
        })
    })
    s.on('close', (code, reason) => {
      if (this.onClose) this.onClose(code, reason)
    })
    s.on('error', (err) => {
      if (this.onError) this.onError(err)
    })
    s.on('message', (recv, isBinary) => {
      let data = Buffer.from(recv).toString('utf-8')
      try {
        data = data.toJSON()
      } catch {}
      if (this.onMessage) this.onMessage(data, isBinary)
    })
    s.on('ping', () => {
      if (this.onPing) this.onPing()
    })
    s.on('pong', () => {
      if (this.onPong) this.onPong()
    })
  }
  disconnect() {
    if (this.sock) {
      this.sock.close()
    }
  }
  send(data) {
    this.sock.send(typeof data === 'object' ? JSON.stringify(data) : data)
  }
}

const test = async () => {
  const ws = new WSClient('ws://localhost:3001/farm')
  try {
    ws.onOpen = (s) => {
      console.log('connected ', s)
      ws.send({ cmd: 'register', data: { id: CLIENT_ID } })
      const data = []
      data.push(Math.floor(Math.random() * 1000) / 10)
      data.push(Math.floor(Math.random() * 1000) / 10)
      data.push(Math.floor(Math.random() * 1000) / 10)
      data.push(Math.floor(Math.random() * 1000) / 10)
      data.push(Math.floor(Math.random() * 1000) / 10)
      setInterval(() => {
        ws.send({
          cmd: 'signal',
          data: {
            id: CLIENT_ID, //data: data.join('|') } })
            data: data.map((i) => i.toFixed(1)).join('|'),
          },
        }),
          (data[0] +=
            (Math.floor(Math.random() * 50) / 10) *
            (Math.random() > 0.5 ? 1 : -1))
        data[1] +=
          (Math.floor(Math.random() * 50) / 10) * (Math.random() > 0.5 ? 1 : -1)
        data[2] +=
          (Math.floor(Math.random() * 50) / 10) * (Math.random() > 0.5 ? 1 : -1)
        data[3] +=
          (Math.floor(Math.random() * 50) / 10) * (Math.random() > 0.5 ? 1 : -1)
        data[4] +=
          (Math.floor(Math.random() * 50) / 10) * (Math.random() > 0.5 ? 1 : -1)
      }, INTERVAL)
    }
    ws.onMessage = (s, b) => {
      console.log('message ', s, b)
    }
    ws.onClose = (c, r) => {
      console.log('disconnected ', c, r)
    }
    ws.connect()
  } catch (e) {
    console.error(e)
  }
}

const INTERVAL = 5000
const CLIENT_ID = 'rpi-2'
test()
