// const abis = require('./token/IERC721.json')
const abis = require('./token/HMNFT.json')

const classTemplate = (abi, funcs) => {
  const name = abi.contractName
  return `
  import { gas, ethError } from './index'


class ${name} {
  static from(web3,addr) {
    return new ${name}(web3,addr)
  }

  constructor(web3,addr) {
      try {
      this.contract = new web3.eth.Contract(abi,addr)
      this.web3 = web3
      }
      catch(e) { throw e }
  }

  ${funcs}
}

export default ${name}

const abi=${JSON.stringify(abi.abi)}
const bytes=${JSON.stringify(abi.bytecode)}
`
}

const callTemplate = (p) => {
  return `
    async ${p.params} {
        try {
            return await this.contract.methods.${p.params}.call({from: this.account });
        } catch (err) {
            await ethError(err);
            throw err;
        }
    }

    `
}

const methodTemplate = (p) => {
  return `
      async ${p.payable ? p.pp : p.params}  {
          try {
              const call = this.contract.methods.${p.params};
              return await call.send({from: this.account ${
                p.payable
                  ? ', value: this.web3.utils.toWei(value.toString(),"ether")'
                  : ''
              }});
          } catch (err) {
              await ethError(err);
              throw err;
          }
      }
      `
}

//   const methodTemplate = (p) => {
//     return `
//       async ${p.payable ? p.pp : p.params}  {
//           try {
//               const call = this.contract.methods.${p.params};
//               const g = await gas(call, this.account);
//               return await call.send({from: this.account, gas: g ${
//                 p.payable
//                   ? ', value: this.web3.utils.toWei(value.toString(),"ether")'
//                   : ''
//               }});
//           } catch (err) {
//               await ethError(err);
//               throw err;
//           }
//       }
//       `
//   }

const generate = (abi) => {
  const funcs = []
  let pub = null
  abi.abi.map((p) => {
    if (p.type === 'function') {
      let f = [],
        pp = null
      const payable = p.stateMutability && p.stateMutability === 'payable'
      p.inputs.map((i) => f.push(`${i.name}/*${i.type}*/`))
      if (payable) {
        pp = [...f]
        pp.push('value')
        pp = `${p.name}(${pp.join(',')})`
      }
      funcs.push({
        params: `${p.name}(${f.join(',')})`,
        payable,
        pp,
        call: p.outputs && p.outputs.length > 0,
      })
      //   console.log(
      //     `${p.name}(${f.join(',')}) : ${p.outputs && p.outputs.length > 0}`
      //   )
    } else if (p.type === 'constructor') {
      let f = []
      p.inputs.map((i) => f.push(`${i.name}/*${i.type}*/`))
      pub = `async publish(${f.join(',')}) {
        try {
            const call = this.contract.deploy({
                data: bytes,
                arguments:[${f.join(',')}]
            })  
            const g = await gas(call, this.account);
            return await call.send({from: this.account, gas: g});
        } catch (err) {
            await ethError(err);
            throw err;
        }
      }
      `
    }
  })
  let list = ''
  list += `setAccount(account) { 
      this.account = account 
    }
    `
  if (pub) list += pub
  funcs.map((f) => (list += f.call ? callTemplate(f) : methodTemplate(f)))
  return classTemplate(abi, list)
}
const f = generate(abis)
console.log(f)
