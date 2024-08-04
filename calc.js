var calculate = function (s) {
  var buf = []
  var splitUp = s.replace(/\s/gm, '')
  console.log(splitUp)
  splitUp = splitUp.match(/[^\d()]+|[\d.]+/g)
  console.log(splitUp)
  var bOp = null
  var num = 0
  for (var i = 0; i < splitUp.length; i++) {
    switch (splitUp[i]) {
      case ' ':
        continue
      case '*':
        buf.push(parseInt(buf.pop() * parseFloat(splitUp[i + 1])))
        i++
        break
      case '/':
        buf.push(parseInt(buf.pop() / parseFloat(splitUp[i + 1])))
        i++
        break
      case '+':
      case '-':
        buf.push(splitUp[i])
        break
      default:
        buf.push(parseFloat(splitUp[i]))
    }
  }
  console.log(buf)
  var num = 0
  for (var i = 0; i < buf.length; i++) {
    switch (buf[i]) {
      case '+':
        num += buf[i + 1]
        i++
        break
      case '-':
        num -= buf[i + 1]
        i++
        break
      default:
        num = parseFloat(buf[i])
    }
  }
  console.log(buf)
  return parseInt(num)
}

// console.log(calculate('14/3*2'))

const start = 0
const end = 16777215
const ichunkSize = 100000

let currStart = start
let currEnd =
  end - start + 1 < ichunkSize ? end : start + parseInt(ichunkSize) - 1
while (currStart < end) {
  console.log(currStart, currEnd)
  currStart = currEnd + 1
  currEnd = currStart + ichunkSize - 1
  if (currEnd >= end) currEnd = end
}
// console.log(
//   `start:${start} end:${end},cs:${currStart},ce:${currEnd},calc:${parseInt(
//     start + ichunkSize - 1
//   )}`
// )

class DBMan {
  constructor(chuckSize = 100000) {
    this.CHUNKSIZE = chuckSize
  }

  async chunkProc(start, end, fn) {
    let currStart = start
    let currEnd =
      start + this.CHUNKSIZE - 1 > end ? end : start + this.CHUNKSIZE - 1
    let currTotal = 0
    const total = end - start + 1
    let idx = 0
    while (currStart < end) {
      currTotal += currEnd - currStart + 1
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
    }
  }

  async insert(oui, start, end, onUpdate) {
    this.chunkProc(start, end, async (cs, ce, t, ct, idx) => {
      console.time(`insert chunk #${idx}`)
      console.log(cs, ce, t, ct, parseFloat((ct / t) * 100).toFixed(2))
      if (onUpdate) {
        onUpdate()
      }
      console.timeEnd(`insert chunk #${idx}`)
    })
  }

  async remove(oui, start, end, onUpdate) {
    this.chunkProc(start, end, async (cs, ce, t, ct, idx) => {
      console.time(`remove chunk #${idx}`)
      console.log(cs, ce, t, ct, parseFloat((ct / t) * 100).toFixed(2))
      if (onUpdate) {
        onUpdate()
      }
      console.timeEnd(`remove chunk #${idx}`)
    })
  }

  async update(oui, start, end, onUpdate) {
    this.chunkProc(start, end, async (cs, ce, t, ct, idx) => {
      console.time(`update chunk #${idx}`)
      console.log(cs, ce, t, ct, parseFloat((ct / t) * 100).toFixed(2))
      if (onUpdate) {
        onUpdate()
      }
      console.timeEnd(`update chunk #${idx}`)
    })
  }
}

const man = new DBMan()
man.insert('111111', start, end)
