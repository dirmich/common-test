const { ethers, utils, BigNumber } = require('ethers')
const { exit } = require('process')

const contract_addr = '0x321152F3bF53FA5FD414feeB33818Fa0097D0c29'
const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
]
const provider = new ethers.providers.JsonRpcProvider(
  //   'https://data-seed-prebsc-1-s1.binance.org:8545'
  'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
)
const contract = new ethers.Contract(contract_addr, abi, provider)

const cc = BigNumber.from('0x11355d6e217c0000')
console.log(utils.formatUnits(cc), cc)

console.log('Listen')

const sender_skey =
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
const sender_wallet = new ethers.Wallet(sender_skey, provider)
const sender_addr = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
const receiver_addr = '0x9b4eF34934fE70dC84e502a78C47fd4564d7D6F0'
const tx = { to: receiver_addr }

contract.on('Transfer', (a, b, c, e) => {
  //   console.log(c, e)
  console.log(`From [${a}] To [${b}] :`)
  let eth = utils.formatUnits(c, 'ether')
  console.log(`${eth}`)
  console.log(`BlockHash: ${e.blockHash}`)
  console.log(`transaction Hash: ${e.transactionHash}`)

  if (b === sender_addr) {
    console.log(`Receive: ${eth}`)
    const toSend = String(parseFloat(eth) * 0.9)
    tx.value = utils.parseEther(toSend)

    sender_wallet
      .sendTransaction(tx)
      .then((r) => console.log(`send ${toSend}ETH :  ${r.hash}`))
  }
  //   contract.removeAllListeners('Transfer')
  //   exit(0)
})
