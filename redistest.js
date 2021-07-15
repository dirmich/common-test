const { reject } = require('lodash')
var redis = require('redis')

class Redis {
  constructor(host = 'localhost', port = 6379) {
    this.client = redis.createClient(port, host)
  }

  set(key, val) {
    return new Promise((resolve, reject) => {
      this.client.set(
        key,
        typeof val === 'object' ? JSON.stringify(val) : val,
        (e) => {
          if (e) reject(e)
          resolve()
        }
      )
    })
  }

  get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (e, d) => {
        if (e) reject(e)
        try {
          resolve(JSON.parse(d))
        } catch (e) {
          resolve(d)
        }
      })
    })
  }

  remove(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (e, n) => {
        if (e) reject(e)
        resolve(n)
      })
    })
  }

  loadAll(withValue = false) {
    return new Promise((resolve, reject) => {
      this.client.keys('*', (err, keys) => {
        if (err) reject(err)

        resolve(
          withValue
            ? Promise.all(
                keys.map(async (k) => {
                  return { [k]: await this.get(k) }
                })
              )
            : keys
        )
      })
    })
  }

  match(field, value) {
    return new Promise((resolve, reject) => {})
  }
}

function test(key, val) {
  const r = new Redis()

  r.get(key)
    .then((res) => {
      console.log('get', res)
    })
    .catch((e) => console.log('getE', e))

  r.set(key, val)
    .then(() => {
      r.get(key)
        .then((res) => {
          console.log('get', res)
          r.remove(key)
            .then((res) => {
              console.log('remove', res)
            })
            .catch((e) => console.log('remove', e))
        })
        .catch((e) => console.log('getE', e))
    })
    .catch((e) => console.error('setE', e))
}

// test('a', 'hello')

function test2() {
  const r = new Redis()
  r.loadAll(true).then((keys) => console.log(keys))
}

test2()
