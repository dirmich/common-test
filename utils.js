'use-strict'
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Array 관련 함수 확장
// =========================================================================================================================
if (!Array.prototype.remove) {
  Array.prototype.remove = function (idx, length = 1) {
    let ret = null
    if (typeof idx === 'function') {
      const i = this.findIndex(idx)
      if (i >= 0) {
        ret = this.splice(i, length)
      }
    } else {
      ret = this.splice(idx, length)
    }
    return ret && ret.length === 1 ? ret[0] : ret
  }
}
if (!Array.prototype.getAt) {
  Array.prototype.getAt = function (idx) {
    let ret = null
    if (typeof idx === 'function') {
      const i = this.findIndex(idx)
      if (i >= 0) {
        ret = this[i]
      }
    } else {
      ret = this[idx]
    }
    return ret
  }
}
if (!Array.prototype.filterObject) {
  Array.prototype.filterObject = function (ref) {
    const ret = {}
    this.map((i) => !isNull(ref[i]) && (ret[i] = ref[i]))
    return ret
  }
}

String.prototype.supplant = function (o) {
  return this.replace(/{([^{}]*)}/g, function (a, b) {
    var r = o[b]
    return typeof r === 'string' || typeof r === 'number' ? r : a
  })
}

function isNull(a) {
  return typeof a === undefined || (typeof a !== 'number' && !a)
}

if (!Object.prototype.squeeze) {
  Object.defineProperty(Object.prototype, 'squeeze', {
    value: function (get = false) {
      Object.keys(this).map((i) => (isNull(this[i]) ? delete this[i] : null))
      return get ? this.getQuery() : this
    },
  })
}

if (!Object.prototype.getQuery) {
  Object.defineProperty(Object.prototype, 'getQuery', {
    value: function () {
      const ret = Object.keys(this)
        .map((key) => key + '=' + this[key])
        .join('&')
      return ret ? `?${ret}` : ''
    },
  })
}

if (!Object.prototype.keyval) {
  Object.defineProperty(Object.prototype, 'keyval', {
    value: function (cb) {
      Object.entries(this).forEach(([k, v]) => cb(k, v))
    },
  })
}

if (!Object.prototype.filterObject) {
  Object.defineProperty(Object.prototype, 'filterObject', {
    value: function (ref) {
      const ret = {}
      Object.keys(this).map((i) => !isNull(ref[i]) && (ret[i] = ref[i]))
      return ret
    },
  })
}

// if (!Object.prototype.sq) {
//   Object.prototype.sq = function () {
//     Object.keys(this).map((i) => (isNull(this[i]) ? delete this[i] : null))
//     return this
//   }
// }

// const squeeze = (param) => {
//   Object.keys(param).map((i) => (isNull(param[i]) ? delete param[i] : null))
//   return param
// }

function checkNull(a, v) {
  return isNull(a) ? v : a
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0
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

function checkHangulEnd(str) {
  if (typeof str !== 'string') return false

  var lastLetter = str[str.length - 1]
  var uni = lastLetter.charCodeAt(0)

  if (uni < 44032 || uni > 55203) return false

  return (uni - 44032) % 28 != 0
}

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
function checkChanged(old, val) {
  return old === val ? undefined : val
}

function getTime(time) {
  const buf = time.split(':')
  return parseInt(buf[0]) * 60 + parseInt(buf[1])
}

const checkArgs = (src, ...args) => {
  for (let i = 0; i < args.length; i++) {
    if (src[args[i]] === undefined) return args[i]
  }
  return null
}

module.exports = {
  isNull,
  setDefault,
  checkValid,
  checkNull,
  checkHangulEnd,
  isEmpty,
  checkChanged,
  diff,
  getTime,
  checkArgs,
  // squeeze,
}
