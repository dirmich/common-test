const apikey = {
  ether: 'J29VUPI4HK87QVGYUKXVSUDSGM1XDWV1AC',
  matic: '3PIXTQVF4IVWUEV3JRVXUIUFSIGRG11AF4',
  bsc: 'DT63H5H1HVHVC31V2AAZRGE85TQXQQWYE7',
  arbitrum: 'S9N4U9ACIJMRAJ1JQISH7YCJFTP9QZQQ2N',
}

const networks = {
  mainnet: {
    name: 'mainnet',
    rpc: ['https://mainnet.infura.io/v3/98571ac136f64bd3bd6fd295fc674ced'],
    api: 'https://api.etherscan.io',
    key: apikey.ether,
  },
  ropsten: {
    rpc: 'https://ropsten.infura.io/v3/98571ac136f64bd3bd6fd295fc674ced',
    api: 'https://api-ropsten.etherscan.io',
    key: apikey.ether,
  },
  rinkeby: {
    rpc: 'https://rinkeby.infura.io/v3/98571ac136f64bd3bd6fd295fc674ced',
    api: 'https://api-rinkeby.etherscan.io',
    key: apikey.ether,
  },
  goerli: {
    rpc: 'https://goerli.infura.io/v3/98571ac136f64bd3bd6fd295fc674ced',
    api: 'https://api-goerli.etherscan.io',
    key: apikey.ether,
  },
  kovan: {
    rpc: 'https://kovan.infura.io/v3/98571ac136f64bd3bd6fd295fc674ced',
    api: 'https://api-kovan.etherscan.io',
    key: apikey.ether,
  },

  bnb: {
    rpc: 'https://bsc-dataseed.binance.org',
    api: 'https://api.bscscan.com',
    key: apikey.bsc,
  },
  bnb_test: {
    rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    api: 'https://api-testnet.bscscan.com',
    key: apikey.bsc,
  },
  polygon: {
    rpc: 'https://polygon-rpc.com',
    api: 'https://api.polygonscan.com',
    key: apikey.matic,
  },
  polygonMumbai: {
    rpc: 'https://rpc-mumbai.maticvigil.com',
    api: 'https://api-testnet.polygonscan.com',
    key: apikey.matic,
  },
  arbtrumMain: {
    rpc: 'https://arbitrum-mainnet.infura.io/v3/98571ac136f64bd3bd6fd295fc674ced',
    api: 'https://api.arbiscan.io',
    key: apikey.arbitrum,
  },
  arbtrumTest: {
    rpc: 'https://rinkeby.arbitrum.io/rpc',
    api: 'https://api-testnet.arbiscan.io',
    key: apikey.arbitrum,
  },
}

module.exports = { apikey, networks }
