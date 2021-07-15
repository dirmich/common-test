const numberList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// const initValue = 5

// const totalResult = numberList.reduce(
//   (acc, val, idx) => {
//     console.log(acc, val, idx)
//     return acc, val
//   }
//   //   initValue
// )

// console.log(totalResult)

const snapPoint = (value, velocity, points) => {
  const point = value + 0.2 * velocity
  const diffPoint = (p) => Math.abs(point - p)
  const deltas = points.map((p) => diffPoint(p))
  const minDelta = Math.min(...deltas)
  console.log(point, deltas, minDelta)
  return points.reduce((acc, p) => (diffPoint(p) === minDelta ? p : acc))
}

console.log(snapPoint(10, 1, numberList))
