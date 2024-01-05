const figlet = require('figlet')
const ascii = require('ascii-art')

figlet('Hello', (err, data) => {
  if (err) {
    console.error(err)
  } else console.log(data)
})
