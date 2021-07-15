const fs = require('fs')
const { parseMidi } = require('midi-file')

const midi = fs.readFileSync('./miditest.mid')

const data = parseMidi(midi)

console.log(data)
