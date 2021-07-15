'use-strict'
function isNull(a) {
  return typeof a === undefined || (typeof a !== 'number' && !a)
}

function setDefault(req, defaultOpt) {
  const ret = {}
  for (k in defaultOpt) {
    ret[k] = isNull(req[k]) ? defaultOpt[k] : req[k]
  }
  return ret
}

function checkValid(req, defaultOpt) {
  for (k in defaultOpt) {
    if (isNull(req[k])) return false
  }
  return true
}

let aa = {
  b: 1,
  c: 2,
  d: 0,
}
const opt = { a: 1, b: 2, c: 3, d: 4, e: { f: 2, g: 2 } }
// console.log( isNull(a.d),a.d,typeof a.d)
// console.log(setDefault(a,opt),checkValid(a,opt))
function diff(org, val) {
  const ret = {}
  for (k in val) {
    if (typeof val[k] === 'object') {
      if (org[k] !== undefined) ret[k] = diff(org[k], val[k])
      else ret[k] = val[k]
    } else if (val[k] !== org[k]) ret[k] = val[k]
  }
  return ret
}

const curr = { b: 3, d: 4, e: { f: 2, g: 3 }, h: 1 }

console.log(diff(opt, curr))

const str = '12.5분'
console.log(parseFloat(str))

const { a, b, c, d } = curr

Object.prototype.squeeze = function (get = false) {
  Object.keys(this).map((i) => (isNull(this[i]) ? delete this[i] : null))
  if (get) {
    const ret = Object.keys(this)
      .map((key) => key + '=' + this[key])
      .join('&')
    return ret ? `?${ret}` : ''
  } else return this
}

const squeeze = (param) => {
  Object.keys(param).map((i) => (isNull(param[i]) ? delete param[i] : null))
  return param
}

// let param = { a, b, c, d }.squeeze()
console.log(
  { a, b, c, d }.squeeze(),
  { a, b, c, d }.squeeze(true),
  squeeze({ a, b, c, d })
)

const attributes = [
  'billid',
  'cpname',
  'contentname',
  'billmethod',
  'billamount',
  'cashbalance',
  'billperiodfrom',
  'billperiodto',
  'timezone',
]

Array.prototype.val = function (ref) {
  const ret = {}
  this.map((i) => !isNull(ref[i]) && (ret[i] = ref[i]))
  return ret
}

console.log(attributes.val({ billid: '123', timezone: 'KR', crt: 'w32' }))

Object.entries(curr).forEach(([k, v]) => console.log(`${k}=>${v}`))
