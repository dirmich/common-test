// const moment = require('moment')

const url = 'https://dev.nimble-kona.com/movies/movie_1_1.mp4'

function mini(u) {
  const idx = u.lastIndexOf('/')
  return u.substr(0, idx) + '/mini' + u.substr(idx)
}
// console.log(mini(url))
function getTime(time) {
  const buf = time.split(':')
  return parseInt(buf[0]) * 60 + parseInt(buf[1])
}
// console.log('09:00'.split(':'), getTime('09:59'), getTime('10:00'))

const email = 'jessica@shuttleb.com'
const suffix = '@shuttleb.com'

function validateEmail(str) {
  let idx = str.indexOf(suffix)
  if (idx >= 0) return str
  else {
    idx = str.indexOf('@')
    if (idx >= 0) return str
    else {
      return str + suffix
    }
  }
}
// console.log(validateEmail(email))
// console.log(validateEmail('email@g'))

function checkSuffix(str, sf) {
  let idx = str.indexOf(sf)
  console.log(idx, str.length, sf.length, str.length - sf.length)
  return idx >= 0
    ? str.length - sf.length === idx
      ? str.substr(0, idx)
      : str
    : str
}

// console.log(checkSuffix('jessica@shuttleb.com1', suffix))

function pad(str, padlen = 2, fillchar = '0') {
  return (new Array(padlen + 1).join(fillchar) + str).slice(-padlen)
}

function wsUrlParseFn(u2) {
  const ut = /^(.*:\/\/)(.*)/
  console.log('S]parse0', u2)
  if (!ut.test(u2)) {
    u2 = `https://${u2}`
  }
  console.log('S]parse1', u2)
  let url = new URL(u2)
  console.log('S]parse2', url)
  const srcProto = url.protocol.toLowerCase()
  console.log('S]parse3', srcProto)
  if (srcProto !== 'https:' && srcProto !== 'http') {
    u2 = u2.replace(/^(.*:\/\/)(.*)/gm, '$2')
    url = new URL(`http://${u2}`)
  }
  console.log('S]parse4', u2, url)
}

// console.log(wsUrlParseFn('highmaru.com:4222'))
// // console.log(pad(123, 5))

// // const m = moment()
// // console.log(m.day())
// // console.log(m.weekday())
// // console.log(m.isoWeekday())

// function getCount(str) {
//   return (str.match(/[aeiou]/gi) || []).length
// }

// const t = new Date().getTime()
// const t2 = moment(new Date(t)).format('LT')
// console.log(t, t2, getCount('compare with your solution'))

const arrtest = () => {
  const arr = [
    { idx: 0, v: '0' },
    { idx: 1, v: '1' },
    { idx: 2, v: '2' },
  ]
  // const r = [...arr.filter((a) => a.idx !== 1)]
  // r.push({ idx: 1, v: '3' })
  const idx = 1
  const r = { ...arr, [idx.toString()]: { idx: 1, v: '3' } }
  console.log(r)
}

const pointer = () => {
  const arr = [
    { idx: 0, v: '0' },
    {
      idx: 1,
      v: '1',
      arr: [
        { idx: 0, v: '0' },
        { idx: 1, v: '1' },
        { idx: 2, v: '2' },
      ],
    },
    { idx: 2, v: '2' },
  ]
  let p = arr[1]
  p = p['arr']
  p = p[0]
  p.v = '9'
  console.log(p, JSON.stringify(arr))
}

// pointer()
const arrtest2 = () => {
  const arr = [
    { idx: 0, v: '0' },
    { idx: 1, v: '1' },
    { idx: 2, v: '2' },
  ]
  const { [2]: ready, ...rest } = arr
  console.log(ready, Object.values(rest))
}

// arrtest2()

const getRandomString = (len, isHex = false) => {
  return isHex
    ? [...Array(len)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join('')
    : new Array(len).join().replace(/(.|$)/g, function () {
        return ((Math.random() * 36) | 0)
          .toString(36)
          [Math.random() < 0.5 ? 'toString' : 'toUpperCase']()
      })
}
// console.log(getRandomString(17))
// console.log(getRandomString(50, true))

let data = `import mongoose from 'mongoose'
import apaginate from 'mongoose-aggregate-paginate-v2'
import paginate from 'mongoose-paginate-v2'

const Schema = new mongoose.Schema(
  {
    	name:String,
	nick:String,
	phone:String,
	email:String,
	passwd:String,
	type:String,
	active:Boolean,
	picture:String,
	pushkey:String,
  
  },
  {
    timestamps: true,
    toJSON: {
      // for external response
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.__v
      },
    },
    toObject: {
      virtuals: true,
      // for internal response
      transform: function (doc, ret) {
        delete ret.__v
      },
    },
  }
)

Schema.statics.byOwner = async function (uid) {
  const list = await this.find({ owner: uid }).sort({ createdAt: -1 })
  return list //as
}


Schema.plugin(apaginate)
Schema.plugin(paginate)
export default mongoose.model('user', Schema)
`
// data = data.replace(/^[\s]*\/\/[^]*/g, '=>')
// const ex = /(^Schema[^.]*)/g
// data = data.split('\n').join('\r\n')
const ex = /[^\s]*\s*\/\/[^\r\n]*/g
const data2 = data.replace(ex, '')
// const data2 = data.match(ex)
// const data2 = ''

// console.log(data, data2)
const t = ['https://fronturl', 'http://localhost:3002']
console.log(t.indexOf('http://localhost:3002'))
