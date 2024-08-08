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
