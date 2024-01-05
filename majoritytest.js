var majorityElement = function (nums) {
  var res = {}
  nums.forEach((i) => {
    if (res[`${i}`]) res[`${i}`]++
    else res[`${i}`] = 1
  })
  console.log(res)
  var ret = []
  Object.keys(res).map((i) => {
    if (res[i] > nums.length / 3) ret.push(i)
  })
  return ret
}

var 높은빈도찾기 = function (대상배열) {
  var 결과 = {}
  대상배열.forEach((아이템) => {
    if (결과[`${아이템}`]) 결과[`${아이템}`]++
    else 결과[`${아이템}`] = 1
  })
  var 리턴 = []
  Object.keys(결과).map((아이템) => {
    if (결과[아이템] > 대상배열.length / 3) 리턴.push(아이템)
  })
  return 리턴
}
// console.log(majorityElement([3, 2, 3]))
console.log(높은빈도찾기([3, 2, 3]))
