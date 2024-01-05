var summaryRanges = function (nums) {
  var start = null,
    curr = null
  var buf = []
  nums.forEach((num) => {
    // console.log('->', start, curr, num)
    if (start === null) {
      start = num
      curr = num
      //   console.log(start, curr, num)
    } else {
      //   console.log(start, curr, num)
      if (curr != num - 1) {
        if (curr === null) buf.push(`${start}`)
        else if (start == curr) buf.push(`${start}`)
        else buf.push(`${start}->${curr}`)
        start = curr = num
      } else {
        curr = num
      }
      //   console.log(start, curr, num)
    }
  })
  if (curr != null) {
    if (start == curr) buf.push(`${start}`)
    else buf.push(`${start}->${curr}`)
  }

  return buf
}

console.log(summaryRanges([0, 2, 3, 4, 6, 8, 9]))
