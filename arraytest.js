const buf = []

buf['1'] = 'a'
buf['2'] = 'b'

console.log(buf)
delete buf['1']
console.log(buf, buf['1'])

const sample =
  'did:key:zUewNx6pAKABMemqTqcEWAEPVxht1ktr9ugLyXkoHiSAzhQBDNRdC2nLauoLKcwstytQCYeCazJ8m4rowp27ivJS4NmofDMAMjLqbqcn1tVKQTAk45d7wzcJZwJaZaAkSu78wFK'

console.log(sample.split('did:key:').pop())

const buf2 = {}
buf2['1'] = 'a'
buf2['2'] = 'b'
console.log(buf2)
delete buf2['1']
console.log(buf2, buf2['1'])
