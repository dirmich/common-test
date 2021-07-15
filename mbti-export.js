const quiz = require('./mbti-quiz0')
const fs = require('fs')

// fs.writeFile('mbti.json', JSON.stringify(quiz), (err) => {
//   if (err) throw err
//   console.log('saved')
// })
const ko = quiz['ko']
Object.keys(quiz).map((k) => {
  //   console.log('k=', k)
  if (k !== 'ko')
    for (let i = 0; i < quiz[k].length; i++) {
      quiz[k][i].ok = ko[i].ok
      //   if (i == 0) console.log(quiz[k][i].ok, ko[i])
    }
})

function load() {
  const list = Object.keys(quiz).map((k) => {
    return {
      lang: k,
      quiz: quiz[k],
    }
  })
  //   console.log(list)
  return list
}

// const list = load()

// fs.writeFile('mbti1.json', JSON.stringify(list), (err) => {
//     if (err) throw err
//     console.log('saved')
//   })
fs.writeFile('mbti2.json', JSON.stringify(quiz), (err) => {
  if (err) throw err
  console.log('saved')
})
