const LogLevels = ['info', 'error', 'warning']

const createLogCollector = () => {
  const logs = []
  const getAll = () => logs

  const logFunctions = {}
  LogLevels.forEach(
    (level) =>
      (logFunctions[level] = (message) => {
        logs.push({ message, level, timestamp: new Date() })
      })
  )
  return {
    getAll,
    ...logFunctions,
  }
}

const log = createLogCollector()
log.info('hello info')
log.warning('hello warning')
log.error('hello error')
const logs = log.getAll()
console.log(log, logs)
for (const l in logs) {
  console.log('->', l, logs[l])
}
