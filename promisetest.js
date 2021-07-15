const timeout = async (task, milliseconds) => {
  const checkTimeout = new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error(`Timeout ${milliseconds}`)), milliseconds)
  })
  const ret = await Promise.race([checkTimeout, task])
  return ret
}

const sample = new Promise((resolve, reject) => {
  setTimeout(() => resolve(), 100)
})

timeout(sample, 100)
  .then((r) => console.log('ok', r))
  .catch((e) => console.error(e))
