const check_power = (num, power = 2) => {
  if (!num) return false
  const org = num
  let count = 0
  while (num % power === 0) {
    num /= power
    count++
  }
  //   console.log('c', count)
  return num === 1 ? count : false
}

// console.log(check_power(1))

// const list = Array(15).map((_, idx) => idx)
const list = [...Array(15).keys()].reduce((acc, curr, idx) => {
  //   console.log(acc, curr, idx)
  acc[idx] = ''
  return acc
}, {})
console.log(JSON.stringify(list))
