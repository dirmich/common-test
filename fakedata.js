const { faker } = require('@faker-js/faker')

// faker.setLocale('ja')
const makeItem = () => {
  const ret = {
    // name: faker.name.findName(),
    // email: faker.internet.email(),
    // imageUrl: faker.image.avatar(600, 800, true),
    // job: faker.name.jobType(),
    // // gender: faker.name.gender(true),

    key:faker.random.uuid(),
    subType: faker.commerce.productName(),
    color: `${}`
  }
  return ret
}

const list = []
const count = 100
for (let i = 0; i < count; i++) list.push(makeItem())
// console.log(`const list=${list}`)
console.log(list)
