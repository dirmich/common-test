require('dotenv').config()

// --filename-- .env (ETHERSCAN_API_KEY, BSCSCAN_API_KEY, POLYGONSCAN_API_KEY, ARBISCAN_API_KEY, INFURA_PROJECT_ID)
const apikey = {
  ether: process.env.ETHERSCAN_API_KEY || '',
  bsc: process.env.BSCSCAN_API_KEY || '',
  matic: process.env.POLYGONSCAN_API_KEY || '',
  arbitrum: process.env.ARBISCAN_API_KEY || '',
}
const infura = process.env.INFURA_PROJECT_ID || ''
const networks = {
  mainnet: { name: 'mainnet', rpc: [`https://mainnet.infura.io/v3/${infura}`], api: 'https://api.etherscan.io', key: apikey.ether },
  ropsten: { rpc: `https://ropsten.infura.io/v3/${infura}`, api: 'https://api-ropsten.etherscan.io', key: apikey.ether },
  rinkeby: { rpc: `https://rinkeby.infura.io/v3/${infura}`, api: 'https://api-rinkeby.etherscan.io', key: apikey.ether },
  goerli: { rpc: `https://goerli.infura.io/v3/${infura}`, api: 'https://api-goerli.etherscan.io', key: apikey.ether },
  kovan: { rpc: `https://kovan.infura.io/v3/${infura}`, api: 'https://api-kovan.etherscan.io', key: apikey.ether },
  bnb: { rpc: 'https://bsc-dataseed.binance.org', api: 'https://api.bscscan.com', key: apikey.bsc },
  bnb_test: { rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545', api: 'https://api-testnet.bscscan.com', key: apikey.bsc },
  polygon: { rpc: 'https://polygon-rpc.com', api: 'https://api.polygonscan.com', key: apikey.matic },
  polygonMumbai: { rpc: 'https://rpc-mumbai.maticvigil.com', api: 'https://api-testnet.polygonscan.com', key: apikey.matic },
  arbtrumMain: { rpc: `https://arbitrum-mainnet.infura.io/v3/${infura}`, api: 'https://api.arbiscan.io', key: apikey.arbitrum },
  arbtrumTest: { rpc: 'https://rinkeby.arbitrum.io/rpc', api: 'https://api-testnet.arbiscan.io', key: apikey.arbitrum },
}
module.exports = { apikey, networks }
