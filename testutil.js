const {} = require('./utils')

const a = [1, 2, 3, 4, 5]

const idx = a.findIndex((i) => i === 3)
console.log(a)
// a.remove(idx, 2)
let ret = a.remove((i) => i === 3)
console.log(ret, a)

const str = []
const ref = 'ABCDEFGHIJKLMN'
for (let i = 0; i < 10; i++) {
  str.push({
    idx: i,
    value: ref[i],
  })
}

console.log(str)
ret = str.remove((i) => i.value === 'E')
console.log(ret, str)
ret = str.remove((i) => i.idx === 3, 3)
console.log(ret, str)
