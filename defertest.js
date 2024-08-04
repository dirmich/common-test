function Defer(func) {
  let _resolve, _reject
  const _p = new Promise((resolve, reject) => {
    _resolve = resolve
    _reject = reject
  })
  const trigger = (function (func) {
    let _result = undefined
    return function () {
      if (_result) return _result
      return (_result = func()
        .then((data) => _resolve(data))
        .catch((e) => _reject(e)))
    }
  })(func)

  return {
    get promise() {
      return _p
    },
    trigger,
  }
}

const deferred = Defer(async () => {
  setTimeout(() => {
    console.log('hello')
    return 5
  }, 5000)
  return 4
})
console.log('->', deferred)
deferred.promise
  .then((a) => console.log('end', a))
  .catch((e) => console.log('err', e))
console.log('ready')
deferred.trigger()
console.log('finish')
