const SvgUtil = require('./svgutil')

const SIZE = 150

const p1 = { x: 0, y: 0 }
const p2 = { x: SIZE, y: 0 }
const p3 = { x: SIZE, y: SIZE }
const p4 = { x: 0, y: SIZE }
const svg = SvgUtil(p1)
svg.addLine(p2)
svg.addCurve(p3)
svg.addLine(p4)
svg.addCurve(p1)
const p = svg.serialize()
svg.print()
console.log(p)
