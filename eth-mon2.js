const { ethers, utils, BigNumber } = require('ethers')
// const fetch = require('node-fetch')
const { networks } = require('./eth-env')
const key = 'J29VUPI4HK87QVGYUKXVSUDSGM1XDWV1AC'
const base = networks.rinkeby
const axios = require('axios').create({
  baseURL: base.api,
})

const provider = new ethers.providers.JsonRpcProvider(base.rpc)

console.log('Listen')
const sender_skey =
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
const sender_wallet = new ethers.Wallet(sender_skey, provider)
const sender_addr = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
const receiver_addr = '0x9b4eF34934fE70dC84e502a78C47fd4564d7D6F0'
const tx = { to: receiver_addr }

let lastblock = 0
const test = async () => {
  const ret = await axios.get(
    `/api?module=block&action=getblockcountdown&blockno=12252982&apikey=${base.key}`
  )
  let {
    result: { CurrentBlock: lastblock },
  } = ret.data
  let loading = false
  setInterval(async () => {
    // const ret = fetch(
    //   `${url}&action=txlist&address=${sender_addr}&startblock=${lastblock}&page=1&apikey=${key}`,
    //   { method: 'GET' }
    // )
    // console.log('LAST] ', lastblock)
    // const ret = await axios.get(
    //   `/api?module=account&action=txlist&address=${sender_addr}&startblock=${lastblock}&page=1&apikey=${key}`
    // )
    // const { result } = ret.data
    // // console.log('-->', result, result.length)
    // if (result.length > 0) {
    //   for (let i = 0; i < result.length; i++) {
    //     const item = result[i]
    if (!loading) {
      try {
        const ret = await axios.get(
          `/api?module=account&action=balance&address=${sender_addr}&tag=latest&apikey=${base.key}`
        )

        let { result: wei } = ret.data
        eth = utils.formatUnits(wei, 'ether')
        console.log('balance] ', eth)
        // const eth = utils.parseEther(item.value)
        //     console.log(`${item.from} --> ${item.to} : ${eth}`)
        if (parseFloat(eth) >= 0.01) {
          loading = true
          const toSend = String(parseFloat(wei) * 0.9)
          tx.value = toSend

          console.log(`send ${utils.formatUnits(toSend, 'ether')}ETH`)
          sender_wallet.sendTransaction(tx).then((r) => {
            console.log(
              `senT ${utils.formatUnits(toSend, 'ether')}ETH :  ${r.hash}`
            )
            loading = false
          })
          // if (i === result.length - 1) {
          //   lastblock = item.blockNumber
          // }
          // }
          // }
        }
      } catch (e) {
        loading = false
      }
    }
  }, 3000)
}

test()
