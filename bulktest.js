import mongo, { Model } from './testmongo.js'

function Defer(func) {
  let _resolve, _reject
  const _p = new Promise((resolve, reject) => {
    _resolve = resolve
    _reject = reject
  })
  const trigger = (function (func) {
    let _result = undefined
    return function () {
      if (_result) return _result
      return (_result = func()
        .then((data) => _resolve(data))
        .catch((e) => _reject(e)))
    }
  })(func)

  return {
    get promise() {
      return _p
    },
    trigger,
  }
}

const start = 0
// const end = 16777215
const end = 1000000
const ichunkSize = 100000

class DBMan {
  constructor(chuckSize = ichunkSize) {
    this.CHUNKSIZE = chuckSize
    this.dbloaded = false
    // this.initDB()
  }
  async initDB() {
    this.db = await mongo
    this.dbloaded = true
  }

  async chunkProc(start, end, fn) {
    return new Promise(async (resolve, reject) => {
      let currStart = start
      let currEnd =
        start + this.CHUNKSIZE - 1 > end ? end : start + this.CHUNKSIZE - 1
      let currTotal = 0
      const total = end - start + 1
      let idx = 0
      while (currStart < end) {
        currTotal += currEnd - currStart + 1
        try {
          if (fn) await fn(currStart, currEnd, total, currTotal, idx)
          // await fn({
          //   idx: {
          //     $gte: currStart,
          //     $lte: currEnd,
          //   },
          // })
          idx++
          currStart = currEnd + 1
          currEnd =
            currStart + this.CHUNKSIZE - 1 > end
              ? end
              : currStart + this.CHUNKSIZE - 1
        } catch (e) {
          reject(e)
        }
      }
      resolve(true)
    })
  }

  async test(start, end) {
    if (!this.dbloaded) await this.initDB()
    return this.remove('', start, end, async (p) => {
      console.log('#', p)
    })
  }
  async insert(oui, start, end, onUpdate) {
    return this.chunkProc(start, end, async (cs, ce, t, ct, idx) => {
      console.time(`insert chunk #${idx}`)
      console.log(cs, ce, t, ct, parseFloat((ct / t) * 100).toFixed(2))
      const docs = []
      for (let i = cs; i <= ce; i++) {
        docs.push({ idx: i, msg: `Test #${i}` })
      }
      await Model.insertMany(docs)
      if (onUpdate) {
        onUpdate(parseInt((ct / t) * 100))
      }
      console.timeEnd(`insert chunk #${idx}`)
    })
  }

  async remove(oui, start, end, onUpdate) {
    return this.chunkProc(start, end, async (cs, ce, t, ct, idx) => {
      console.time(`remove chunk #${idx}`)
      console.log(cs, ce, t, ct, parseFloat((ct / t) * 100).toFixed(2))
      await Model.deleteMany({ idx: { $gte: cs, $lte: ce } })
      if (onUpdate) {
        onUpdate(parseInt((ct / t) * 100))
      }
      console.timeEnd(`remove chunk #${idx}`)
    })
  }

  async update(oui, start, end, onUpdate) {
    return this.chunkProc(start, end, async (cs, ce, t, ct, idx) => {
      console.time(`update chunk #${idx}`)
      console.log(cs, ce, t, ct, parseFloat((ct / t) * 100).toFixed(2))
      if (onUpdate) {
        onUpdate(parseInt((ct / t) * 100))
      }
      console.timeEnd(`update chunk #${idx}`)
    })
  }
}

const man = new DBMan()
// man.insert('111111', start, end)
const deferred = Defer(async () => {
  console.time('proc')
  return man
    .test(start, end)
    .then(() => {
      console.log('finish')
      return true
    })
    .catch((e) => {
      console.log('error')
      return false
    })
    .finally(() => {
      console.timeEnd('proc')
    })
})

deferred.promise
  .then((a) => console.log('defer end', a))
  .catch((e) => console.log('defer err', e))
deferred.trigger()
