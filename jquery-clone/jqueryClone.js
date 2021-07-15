class Elements extends Array {
  ready(cb) {
    const isReady = this.some((e) => {
      return e.readyState != null && e.readyState != 'loading'
    })
    console.log(isReady)
    if (isReady) {
      cb()
    } else this.on('DOMContentLoaded', cb)
    return this
  }
  on(event, sel, cb) {
    if (typeof sel === 'function') {
      this.forEach((e) => e.addEventListener(event, sel))
    } else {
      this.forEach((elem) => {
        elem.addEventListener(event, (e) => {
          if (e.target.matches(sel)) cb(e)
        })
      })
    }
    return this
  }
  next() {
    return this.map((e) => e.nextElementSibling).filter((e) => e != null)
  }
  prev() {
    return this.map((e) => e.previousElementSibling).filter((e) => e != null)
  }
  addClass(c) {
    this.forEach((e) => e.classList.add(c))
    return this
  }
  removeClass(c) {
    this.forEach((e) => e.classList.remove(c))
    return this
  }
  css(field, val) {
    const camel = field.replace(/(-[a-z])/, (g) =>
      g.replace('-', '').toUpperCase()
    )
    this.forEach((e) => (e.style[camel] = val))
    return this
  }
}

function $(param) {
  if (typeof param === 'string' || param instanceof String) {
    return new Elements(...document.querySelectorAll(param))
  } else {
    return new Elements(param)
  }
}

class AjaxPromise {
  constructor(promise) {
    this.promise = promise
  }
  done(cb) {
    this.promise = this.promise.then((d) => {
      cb(d)
      return d
    })
    return this
  }
  fail(cb) {
    this.promise = this.promise.catch(cb)
    return this
  }
  always(cb) {
    this.promise = this.promise.finally(cb)
    return this
  }
}

$.get = function ({ url, data = {}, success = () => {}, dataType }) {
  const query = Object.entries(data)
    .map(([k, v]) => `${k}=${v}`)
    .join('&')
  return new AjaxPromise(
    fetch(`${url}${Object.entries(data).length > 0 ? '?' + query : ''}`)
      .then((r) => {
        if (r.ok) return r.json(r)
        else throw new Error(r.status)
      })
      .then((d) => {
        success(d)
        return d
      })
  )
}
