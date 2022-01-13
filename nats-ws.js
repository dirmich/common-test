const WebSocket = require('ws')

const MSG =
  /^MSG\s+([^\s\r\n]+)\s+([^\s\r\n]+)\s+(([^\s\r\n]+)[^\S\r\n]+)?(\d+)\r\n(.*)/i
const OK = /^\+OK\s*\r\n/i
const ERR = /^-ERR\s+('.+')?\r\n/i
const PING = /^PING\r\n/i
const PONG = /^PONG\r\n/i
const INFO = /^INFO\s+([^\r\n]+)\r\n/i
const SUBRE = /^SUB\s+([^\r\n]+)\r\n/i

const CMD = {
  MSG: 1,
  OK: 0,
  ERR: -1,
  PING: 2,
  PONG: 3,
  INFO: 4,
}
class Nats {
  constructor(url, opt = {}) {
    if (Nats.instance) {
      console.log('NATS] exist')
      return Nats.instance
    }
    Nats.instance = this
    const defaultOpt = {
      verbose: false,
      echo: false,
      lang: 'go',
      version: '1.0',
      tls_required: true,
      pedantic: false,
      protocol: 1,
    }
    this.url = url
    this.subs = []
    this.hash = []
    this.enc = new TextEncoder()
    this.dec = new TextDecoder('utf-8')
    this.sid = 1
    this.rid = 1
    this.opt = { ...defaultOpt, ...opt }
    this.isConnected = false
  }
  connect() {
    if (this.sock) delete this.sock
    const ws = new WebSocket(this.url)
    ws.binaryType = 'arraybuffer'
    this.setEvents(ws)
    this.sock = ws
  }
  close() {
    if (this.sock) this.sock.close()
  }
  conv(str) {
    // console.log('CONV]', str)
    return this.enc.encode(str)
  }
  send(cmd, data) {
    let payload = cmd
    if (data) {
      const tmp = typeof data === 'object' ? JSON.stringify(data) : data
      payload += ` ${tmp.length}\r\n${tmp}\r\n`
    } else {
      payload += '\r\n'
    }
    // console.log('send:', payload)
    this.sock.send(this.conv(payload))
  }
  sendInfo() {
    this.send(`CONNECT ${JSON.stringify(this.opt)}`)
  }
  publish(subject, data) {
    this.send(`PUB ${subject}`, data)
  }
  subscribe(subject, cb = null) {
    if (this.hash[subject]) return
    this.hash[subject] = this.sid
    if (cb) {
      const callback = typeof cb === 'function' ? cb : () => cb
      this.subs[this.sid] = { cb: callback, recv: false }
    }
    this.send(`SUB ${subject} ${this.sid}`)
    this.sid++
  }
  request(subject, data) {
    this.send(`PUB ${subject} INBOX#${this.rid}`, data)

    return new Promise((resolve, reject) => {
      const ts = setTimeout(() => reject(false), 3000)
      this.subscribe(`INBOX#${this.rid}`, (subject, data, reply) => {
        clearTimeout(ts)
        resolve(data)
        return false
      })
      this.unsubscribe(`INBOX#${this.rid}`, 1)
      this.rid++
    })
  }
  respond(m, data) {
    this.send(`PUB ${m[4]}`, data)
  }
  checkRecv(sid) {
    if (this.subs[sid]) {
      if (this.subs[sid].count) {
        this.subs[sid].count--
        if (this.subs[sid].count > 1) return
        else {
          const key = Object.keys(this.hash).find(
            (key) => this.hash[key] === sid
          )
          delete this.subs[sid]
          delete this.hash[key]
          // if (hash.length>0) delete
        }
      }
    }
  }
  unsubscribe(subject, count = 0) {
    if (this.hash[subject]) {
      let cmd = `UNSUB ${this.hash[subject]}`
      if (count > 0) {
        cmd += ` ${count}`
        this.subs[this.hash[subject]].count = count
      } else {
        delete this.subs[this.hash[subject]]
        delete this.hash[subject]
      }
      this.send(cmd)
    }
  }
  setEvents(s) {
    s.onopen = () => {
      this.isConnected = true
      if (this.onOpen) {
        this.onOpen({
          req: s._socket.remoteAddress,
        })
      }
      this.sendInfo()
    }

    s.onclose = (code, reason) => {
      this.isConnected = false
      if (this.onClose) this.onClose(code, reason)
    }

    s.onerror = (err) => {
      if (this.onError) this.onError(err)
    }

    s.onmessage = async (e) => {
      let data = Buffer.from(e.data).toString('utf-8')
      // try {
      //   data = JSON.parse(data) //data.toJSON()
      // } catch {}
      // console.log('R]', isBinary, data)
      const msg = await this.parse(data)
      // console.log(msg)
      switch (msg.cmd) {
        case CMD.PING:
          this.send('PONG')
          break
        case CMD.MSG: {
          if (this.onMessage && !msg.respond)
            this.onMessage(msg.subject, msg.param)
        }
      }
    }
  }
  async parse(str) {
    let m
    let param = []
    let cmd = ''
    let subject = ''
    let resp = false
    if ((m = MSG.exec(str)) !== null) {
      cmd = CMD.MSG
      subject = m[1]
      param = m[6] ? JSON.parse(m[6]) : null
      // console.log('M]', m)
      const sub = this.subs[parseInt(m[2])]
      if (sub) {
        resp = !!m[3]
        const data = await sub.cb(subject, param, resp)
        if (m[3]) this.respond(m, data)
      }
    } else if ((m = OK.exec(str)) !== null) {
      cmd = CMD.OK
    } else if ((m = ERR.exec(str)) !== null) {
      cmd = CMD.ERR
    } else if ((m = PONG.exec(str)) !== null) {
      cmd = CMD.PONG
    } else if ((m = PING.exec(str)) !== null) {
      cmd = CMD.PING
    } else if ((m = INFO.exec(str)) !== null) {
      cmd = CMD.INFO
      param = JSON.parse(m[1])
    } else {
      console.log('PARSE ERR]', str)
      return {
        err: 'err',
      }
    }
    // console.log('PARSE]', m)
    return {
      cmd,
      param,
      subject,
      respond: resp,
    }
  }
}

const test = async () => {
  const ws = new Nats('wss://highmaru.com:4223')
  try {
    ws.onOpen = async (s) => {
      console.log('connected ')
      await ws.sendInfo()
      // setTimeout(() => {
      ws.subscribe('calc.*')
      ws.subscribe('calc.add', (subject, param, resp) => ({
        result: param.a + param.b,
      }))
      ws.onMessage = (subject, data) => {
        console.log('MSG]', subject, data)
      }
      // }, 0)
    }
    //   ws.onMessage = (s, b) => {
    //     console.log('message ', s, b)
    //   }
    //   ws.onClose = (c, r) => {
    //     console.log('disconnected ', c, r)
    //   }
    ws.connect()
  } catch (e) {
    console.error(e)
  }
}

// for (let i = 1; i <= 2; i++) test(`rpi-${i}`)
test()
