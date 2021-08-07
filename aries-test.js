const { Agent } = require('@aries-framework/core')
const { agentDependencies } = require('@aries-framework/node')
const makeId = (id) => {
  const zero = '00000000000000000000000000000000'
  return (zero + id).substr(id.length)
}
const test = async () => {
  const agent = new Agent(
    {
      label: 'test',
      walletConfig: { id: 'testwallet' },
      walletCredentials: { key: '0000000000000000000000000000test' },
      publicDidSeed: makeId('test11'),
      endpoint: 'https://192.168.0.2:3111',
    },
    agentDependencies
  )
  try {
    await agent.initialize()
    console.log('initialized', agent.publicDid)
    let { invitation, connectionRecord } =
      await agent.connections.createConnection({
        // routing: { endpoint: 'https://data4lifesp.margin.ga/invite' },
      })
    console.log(
      '->',
      invitation.toUrl('https://data4lifesp.margin.ga'),
      connectionRecord
    )

    const conn = await agent.connections.returnWhenIsConnected(
      connectionRecord.id
    )
    console.log('conn', conn)
  } catch (err) {
    console.error(err)
  }
}

test()
