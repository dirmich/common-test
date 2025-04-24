const list = [
  '1KB',
  '1.5KB',
  '2.5MB',
  '3.5GB',
  '4.5TB',
  '5.5PB',
  '6.5EB',
  '7.5ZB',
  '8.5YB',
]
export const convertToBytes = (str) => {
  const match = str.match(/(\d+(\.\d+)?)[ ]?([KMG]?B)/i)
  //   console.log('match', match)
  if (!match) return 0
  const value = parseFloat(match[1])
  const unit = match[3].toUpperCase()
  //   console.log('value', value, unit)
  let bytes
  if (unit === 'B') {
    bytes = value
  } else if (unit === 'KB') {
    bytes = value * 1024
  } else if (unit === 'MB') {
    bytes = value * 1024 * 1024
  } else if (unit === 'GB') {
    bytes = value * 1024 * 1024 * 1024
  } else {
    return 0 // Handle unknown unit - return 0 for safety
  }
  //   console.log('bytes', str, bytes)
  return bytes
}
console.log('1KB', convertToBytes('1 KB'))
console.log('1.5KB', convertToBytes('1.5 KB'))
console.log('2.5MB', convertToBytes('2.5 MB'))
console.log('3.5GB', convertToBytes('3.5GB'))
