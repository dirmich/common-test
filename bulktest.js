import { parallel } from 'radash'
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
const NUM_PROC = 3
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

  async chunkProc1(start, end, fn) {
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
  async chunkProc(start, end, fn) {
    return new Promise(async (resolve, reject) => {
      let currStart = start
      let currEnd =
        start + this.CHUNKSIZE - 1 > end ? end : start + this.CHUNKSIZE - 1
      let currTotal = 0
      const total = end - start + 1
      let idx = 0
      const proc = []
      while (currStart < end) {
        currTotal += currEnd - currStart + 1
        try {
          proc.push({ currStart, currEnd, total, currTotal, idx })
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
      parallel(NUM_PROC, proc.reverse(), async (item) => {
        if (fn) {
          await fn(
            item.currStart,
            item.currEnd,
            item.total,
            item.currTotal,
            item.idx
          )
        }
      })
        .then((v) => resolve(true))
        .catch((e) => reject(e))
    })
  }

  async test(start, end) {
    if (!this.dbloaded) await this.initDB()
    const ret = this.insert('', start, end, async (p) => {
      console.log('#', p)
    })
    return ret
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

//
//  chunkproc
// 1000000 insert : proc: 44.517s
// 1000000 remove : proc: 34.134s
// 16777215 insert : proc: 12:49.943
// 16777215 remove : proc: 11:26.120

//  chunkproc2  p3
// 1000000 insert : proc: 36.711s
// 1000000 remove : proc: 23.713s
// 16777215 insert : proc: 10:42.307
// 16777215 remove : proc: 6:55.989

//  chunkproc2  p4
// 1000000 insert : proc: 36.301s
// 1000000 remove : proc: 21.819s
// 16777215 insert : proc: 10:59.915
// 16777215 remove : proc: 6:49.224

//  chunkproc2  p5
// 1000000 insert : proc: 37.668s
// 1000000 remove : proc: 21.609s
// 16777215 insert : proc: 11:15.023
// 16777215 remove : proc: 7:34.055
