const checkargs = (...args) => {
  console.log(...args, args.length)
}

checkargs('a', 'b', 'c')
checkargs('a', 'b')

const req = {
  body: {
    name: '',
    pass: '',
    nick: '',
  },
}

const argsExists = (src, ...args) => {
  for (let i = 0; i < args.length; i++) {
    if (src[args[i]] === undefined) return args[i]
  }
  return null
}

let r = argsExists(req.body, 'name', 'pass')
if (r) console.error('Not exist', r, req.body[r])
r = argsExists(req.body, 'name', 'pass1')
if (r) console.error('Not exist', r, req.body[r])
