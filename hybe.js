const sample = [
  'macaddr',
  '80:DE:CC:14:A6:1F',
  '80:DE:CC:14:A6:21',
  '80:DE:CC:14:A6:22',
  '80:DE:CC:14:A6:23',
  '80:DE:CC:14:A6:24',
  '80:DE:CC:14:A6:25',
  '80:DE:CC:14:A6:26',
  '80:DE:CC:14:A6:27',
  '80:DE:CC:14:A6:28',
  '80:DE:CC:14:A6:29',
  '80:DE:CC:14:A6:2A',
  '80:DE:CC:14:A6:2B',
  '80:DE:CC:15:A6:21',
  '80:DE:CC:15:A6:22',
  '80:DE:CC:15:A6:23',
  '80:DE:CC:15:A6:24',
  '80:DE:CC:15:A6:25',
  '80:DE:CC:15:A6:26',
  '80:DE:CC:15:A6:27',
  '80:DE:CC:15:A6:28',
  '80:DE:CC:15:A6:29',
  '80:DE:CC:15:A6:2A',
  '80:DE:CC:15:A6:2B',
]

const parse3 = (buf) => {
  const r = buf.join('')
  const int = parseInt(r, 16)
  return int
}

const test = () => {
  const items = sample
  const group = []
  let curr = 0
  let curr2 = 0

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const buf = item.split(':')
    if (buf.length !== 6) continue
    const r = parse3(buf.slice(0, 3))
    const r2 = parse3(buf.slice(3, 6))
    if (r !== curr) {
      console.log('curr not eq', curr, r)
      curr = r
      group.push({
        first: buf.slice(0, 3).join(':'),
        start: buf.slice(3, 6).join(':'),
        startnum: r2,
        endnum: r2,
        count: 1,
      })
    } else {
      const last = group[group.length - 1]
      if (r2 === last.endnum + 1) {
        last.endnum = r2
        last.count = last.count + 1
      } else {
        console.log('last not eq', last.endnum, r2)
        group.push({
          first: buf.slice(0, 3).join(':'),
          start: buf.slice(3, 6).join(':'),
          startnum: r2,
          endnum: r2,
          count: 1,
        })
      }
    }
  }
  console.log(group)
}

test()
