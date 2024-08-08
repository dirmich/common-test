import { parallel } from 'radash'

const userIds = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const users = await parallel(5, userIds, async (uid) => {
  console.log('->', uid)
})
