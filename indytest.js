require('./utils')
const indy = require('indy-sdk')
const tool = require('./indytool')

const listPool = async () => {
  return new Promise((resolve, reject) => {
    indy.listPools((err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

const openLedger = async (poolname, ipaddr) => {
  const genesis_txn = await tool.getPoolGenesisTxnPath(poolname, ipaddr) //, '192.168.0.10')
  try {
    console.log('genesis_txn', genesis_txn)
    await indy.createPoolLedgerConfig(poolname, { genesis_txn })
  } catch (err) {
    if (err.indyCode) console.error(err.indyName)
    else throw err
  }
  await indy.setProtocolVersion(2)
  console.log('open pool', poolname)
  const handle = await indy.openPoolLedger(poolname, { timeout: 1 })

  return handle
}

const t2 = async (name, id, key, hPool) => {
  try {
    await indy.createWallet({ id }, { key })
  } catch (e) {
    if (e && e.indyCode) console.error(e.indyName)
    else throw e
  }
  return await indy.openWallet({ id }, { key })
}

const openWalletInPool = async (name, id, key, hPool) => {
  try {
    return indy
      .openWallet({ id }, { key })
      .then(async (ret) => {
        return ret
      })
      .catch((e) => {
        if (e && e.indyCode === 204) {
          console.log('!! ', e)
          indy
            .createWallet({ id }, { key })
            .then((ret) => {
              console.log('-->', ret)
              return ret
            })
            .catch((e1) => {
              throw e1
            })
        } else {
          return -1
        }
      })
  } catch (err) {
    console.error(err)
    return -2
  }
}
// test()
const test = async () => {
  try {
    // await indy.deletePoolLedgerConfig('Node1')
    // await indy.deletePoolLedgerConfig('local_pool')
    // await indy.deletePoolLedgerConfig('test1')
    // await indy.deletePoolLedgerConfig('test3')

    const handle = await openLedger('marginga', '192.168.0.10')
    // const handle = await openLedger('Node1')
    console.log('openLedger', handle)
    const pools = await indy.listPools()
    // console.log('pools', pools)

    await indy.refreshPoolLedger(handle)
    console.log('pools', pools)
    const wh = await openWalletInPool(
      'Sovrin Steward',
      'steward_wallet',
      'steward_wallet+key',
      handle
    )
    console.log('wh', wh)
    let info
    info = await indy.createAndStoreMyDid(wh, {
      seed: '000000000000000000000000Steward1',
    })
    console.log('info', info)
    const faber = await indy.createAndStoreMyDid(wh, {})
    console.log('faber', faber)
    let nymReq = await indy.buildNymRequest(
      info[0],
      faber[0],
      faber[1],
      null,
      null
      //   'TRUSTEE'
    )
    // let nymReq = await indy.buildGetNymRequest(null, info[0])

    // nymReq = await indy.signRequest(wh, info[0], nymReq)
    console.log('nymReq', nymReq)
    // const res = await indy.submitRequest(handle, JSON.stringify(nymReq))
    const res = await indy.signAndSubmitRequest(
      handle,
      wh,
      info[0],
      JSON.stringify(nymReq)
      //   JSON.stringify(nymReq)
    )
    console.log('res', res)
    // const ret = await indy.parseGetNymResponse(res.result)
    // console.log('ret', ret)
    //   info = await indy.keyForDid(handle, wh, 'Th7MpTaRZVRYnPiabds81Y')
    //   console.log('info', info)
    //   info = await indy.getEndpointForDid(wh, handle, 'Th7MpTaRZVRYnPiabds81Y')
    //   console.log('info', info)
    await indy.closeWallet(wh)
    if (handle >= 0) await indy.closePoolLedger(handle)
  } catch (err) {
    console.log('err', err)
  }
}

test()
