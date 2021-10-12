const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
app.use(cors())
app.use(express.static(__dirname + '/'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var testdata = 'This is my message'

app.get('/connect', function (req, res) {
  res.writeHead(200, {
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
  })

  const ts = setInterval(function () {
    const data = {
      msg: testdata,
    }
    console.log('writing ' + JSON.stringify(data))
    res.write(`data:${JSON.stringify(data)}\n\n`)
  }, 1000)

  setTimeout(() => {
    // res.status(200).write('done')
    res.end('data:done', () => {
      clearInterval(ts)
    })
  }, 3000)
  req.on('close', () => {
    console.log('connection closed')
  })
})

/*
app.post('/message', function(req, res) {
  testdata = req.body;
});
*/

var port = 8080
app.listen(port, function () {
  console.log('Running at Port ' + port)
})
