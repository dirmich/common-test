function SvgUtil(pos) {
  const path = {
    move: pos ? pos : { x: 0, y: 0 },
    curves: [],
    close: true,
  }

  return {
    print() {
      'worklet'
      console.log(path)
      path.curves.map((i) => console.log(i))
    },
    addLine(to) {
      'worklet'
      const last = path.curves[path.curves.length - 1]
      const from = last ? last.to : path.move
      console.log('line', last, from)
      path.curves.push({
        c1: { x: from.x, y: from.y },
        c2: { x: to.x, y: to.y },
        to,
      })
    },
    addCurve(to) {
      'worklet'
      const last = path.curves[path.curves.length - 1]
      const from = last ? last.to : path.move
      console.log('curve', last, from, to)
      path.curves.push({
        c1: { x: (to.x - from.x) / 3, y: (to.y - from.y) / 3 },
        c2: { x: ((to.x - from.x) * 2) / 3, y: ((to.y - from.y) * 2) / 3 },
        to,
      })
    },
    serialize() {
      'worklet'
      return `M${path.move.x},${path.move.y} ${path.curves
        .map(
          (c) => `C${c.c1.x},${c.c1.y} ${c.c2.x},${c.c2.y} ${c.to.x},${c.to.y}`
        )
        .join(' ')}${path.close ? 'Z' : ''}`
    },
    parse(str) {
      const ret = str.match(/[a-z][^a-z]*/gi)
      const arr = ret.map((i) => i.trim().split(' '))
      arr.map((item) => {
        switch (item[0]) {
          case 'M':
            break
          case 'L':
            break
          case 'H':
            break
          case 'V':
            break
          case 'C':
            break
          case 'R':
            break
          case 'Z':
          default:
            break
        }
      })
    },
  }
}

module.exports = SvgUtil
