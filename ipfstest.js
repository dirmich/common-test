const IPFS = require('ipfs-http-client')
const ipfs = IPFS.create('https://ipfs.kakaolab.ml')
// const ipfs = IPFS.create('https://ipfs.infura.io:5001')
const addFile = async () => {
  const file = await ipfs.add({
    path: '/testfile',
    content: Buffer.from('hello!1'),
  })
  //   const file = await ipfs.get(
  //     IPFS.CID.asCID('QmadgTwRN54haSYMQLTAxs2bC9yyZBALAg9PEDzZze91nz')
  //   )
  console.log(file, file.cid.toJSON())
}

addFile()
