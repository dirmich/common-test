const sample = '(飛行機/ひこうき)が<山腹>に(衝突/しょうとつ)した'

const toJapString = (str) => {
  const r = /\((.*?)\)/gi
  let out = str.replaceAll(r, '|~$1|')
  const r2 = /<([^>].*?)>/gi
  out = out.replaceAll(r2, '|~~$1|')
  const part = out.split('|')
  const final = part.map((i) => {
    if (i === '') return ''
    if (i.startsWith('~~')) return i.substring(2)
    if (i.startsWith('~')) {
      let s = i.substring(1).split('/')
      return s[1]
    }
    return i
  })
  console.log(final.join(''))
  return final.join('')
}

toJapString(sample)
