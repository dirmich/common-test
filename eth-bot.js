const { ethers, utils } = require('ethers')
const { networks, apikey } = require('./eth-env')
const base = networks.rinkeby

const provider = new ethers.providers.JsonRpcProvider(base.rpc)
// const provider = new ethers.providers.getDefaultProvider('rinkeby')
// const provider = new ethers.providers.getDefaultProvider('homestead', {
//   infura: {
//     projectId: '9aa3d95b3bc440fa88ea12eaa4456161',
//     // projectSecret: '0b5b364c59c24f23be846a7b0fc0a37e',
//   },
// })
const error = console.log
const info = console.log
// console.log('Listen', base.name,provider.getNetwork())
const recv_skey =
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
const recv_addr = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
const fw_addrs = [
  '0x9b4eF34934fE70dC84e502a78C47fd4564d7D6F0',
  '0xd970421d137D3090035fBa7FfDd81f8836Ee71Df',
  '0x5c4F8653Fa07bAD8FEb562112cd5E1726388f85f',
]

const bot = async () => {
  const recv_wallet = new ethers.Wallet(recv_skey, provider)

  provider.on('block', async (bno) => {
    info(`Listening new block, waiting.. ${recv_wallet.address} : ${bno}`)
    const balance = await provider.getBalance(recv_wallet.address)
    const feedata = await provider.getFeeData()
    const gasfee = utils.formatUnits(feedata.maxFeePerGas, 'gwei')
    const txBuffer = ethers.utils.parseUnits(
      String(parseFloat(gasfee * 21000).toFixed(9)),
      'gwei'
    )
    info(`gasfee ${utils.formatUnits(txBuffer, 'ether')}`)

    if (balance.sub(txBuffer) > 0) {
      info('NEW ACCOUNT WITH ETH!')
      const fw_addr = fw_addrs[Math.floor(Math.random() * 3)]
      const amount = balance.sub(txBuffer)
      try {
        await recv_wallet.sendTransaction({
          to: fw_addr,
          value: amount,
        })
        info(
          `Success! transfered [${fw_addr}]-->  ${ethers.utils.formatEther(
            amount
          )}:${ethers.utils.formatEther(txBuffer)}`
        )
      } catch (e) {
        error(`error: ${e}`)
      }
    }
  })
}

bot()
