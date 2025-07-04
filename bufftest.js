class IndexBuffer {
  constructor(maxInstance) {
    this.maxInstance = maxInstance
    this.freeIndices = new Array(maxInstance)
    this.nextIndex = 0
    this.count = 0
    this._init()
  }
  _init() {
    for (let i = 0; i < this.maxInstance; i++) this.freeIndices[i] = 0
  }

  getIndex(fromStart = false) {
    if (fromStart) {
      this.ptr = 0
    }
    if (this.freeIndices[this.ptr] !== 0) return this.ptr++
    while (this.freeIndices[this.ptr] === 0) this.ptr++
    return this.ptr > this.maxInstance - 1 ? -1 : this.ptr++
  }
  add() {
    while (this.freeIndices[this.nextIndex] !== 0) {
      this.nextIndex++
      if (this.nextIndex > this.maxInstance - 1) return -1
    }
    this.freeIndices[this.nextIndex] = 1
    this.count++
    return this.nextIndex
  }

  remove(i) {
    this.freeIndices[i] = 0
    this.nextIndex = i
    this.count--
  }
  removes(ids) {
    ids.map((i) => (this.freeIndices[i] = 0))
    this.nextIndex = ids[0]
    this.count -= ids.length ?? 0
  }
}

const buf = new IndexBuffer(50)

for (let i = 0; i < 10; i++) console.log('add', buf.add())
console.log('count', buf.count)
console.log('remove 3', buf.remove(3))
for (let i = 0; i < 2; i++) console.log('add', buf.add())
console.log('count', buf.count)
console.log('remove 3,4,5,6', buf.removes([3, 4, 5, 6]))
console.log('count', buf.count)
// for (let i = 0; i < 10; i++) console.log('add', buf.add())
// console.log('count', buf.count)

let idx = buf.getIndex(true)
console.log('get index', idx)

while ((idx = buf.getIndex()) >= 0) console.log('get index', idx)

const obj = { 0: 1, 1: 2, 2: 3 }
console.log(obj)
delete obj[1]
console.log(obj)
