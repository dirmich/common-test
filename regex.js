// const str =
//   'M 0 0 L 4 0 C 4 1.3333 4 2.6667 4 4 L 0 4 C 0 2.6667 0 1.3333 0 0 Z'

// const ret = str.match(/[a-z][^a-z]*/gi)
// console.log(ret.map((i) => i.trim().split(' ')))

const restrictReg = /^[^\\\/:*?"<>|]+$/
console.log(restrictReg.test(`123`))
