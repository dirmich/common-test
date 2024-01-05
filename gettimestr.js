function getDigit(num, len) {
  let ret = ''
  for (let i = 0; i < len; i++) ret += '0'
  ret += num

  //   return ret.substring(ret.length - 4)
  return ret.slice(-1 * len)
}
function getTS() {
  const d = new Date()
  return (s =
    getDigit(d.getFullYear(), 4) +
    getDigit(d.getMonth() + 1, 2) +
    getDigit(d.getDate(), 2) +
    '_' +
    getDigit(d.getHours(), 2) +
    getDigit(d.getMinutes(), 2) +
    getDigit(d.getSeconds(), 2))
}

console.log(getTS())
