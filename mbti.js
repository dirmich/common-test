var path = require('path')

var fs = require('fs')
var cheerio = require('cheerio')
var request = require('request')
var http = require('http')

const baseurl = 'https://www.16personalities.com/free-personality-test'

function parse(url = null) {
  return new Promise(async function (resolve, reject) {
    await request.get(
      {
        url: url ? url : baseurl,
        referer: 'https://www.16personalities.com',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.99 Safari/537.36',
        },
      },
      (err, resp, html) => {
        if (err) reject(err)
        // console.log(html)
        let retList = []
        let $ = cheerio.load(html)
        const link = $('link[rel="alternate"]')
        // console.log(link)
        for (let i = 0; i < link.length; i++) {
          retList.push({
            lang: $(link[i]).attr('hreflang'),
            url: $(link[i]).attr('href'),
          })
        }
        const q = $('quiz')

        // const list = $('.subb_box')
        // for (let i = 0; i < list.length; i++) {
        //   var image = $(list[i]).find('a span img').attr('src')
        //   var idx = /([0-9]*)\/[^.\/]*\.jpg/.exec(image)[1]
        //   var title = $(list[i]).find('.subb_tit')[0].firstChild.data
        //   var as = $(list[i]).find('.subb_txt')
        //   var writer = as[0].firstChild.data
        //   var count = parseInt(as[1].firstChild.data)
        //   // const alist = $(list[i]).find("a")
        //   const item = {
        //     idx: idx,
        //     imageUrl: image,
        //     bookCount: count,
        //     author: writer,
        //     title: title,
        //   }
        //   retList.push(item)
        // }
        const quiz = JSON.parse($(q).attr(':questions')).map((p) => {
          // p.conv = unescape(encodeURIComponent(p.text))
          return p
        })
        resolve({
          retList,
          q: q,
          quiz: JSON.stringify(quiz),
        })
      }
    )
  })
}

parse().then(async (r) => {
  fs.appendFileSync('quiz0.js', `const quiz={\n`)
  fs.appendFileSync('quiz0.js', `en:${r.quiz},\n`)
  const list = r.retList
  list.sort((a, b) => (a.lang < b.lang ? -1 : a.lang > b.lang ? 1 : 0))

  // list.forEach(async (p) => {
  //   list.map(async (p) => {
  //   console.log('start ', p.lang)
  //   q = await parse(p.url)
  //   console.log('parse ', p.lang)
  //   // await fs.promises.appendFile('quiz0.js', `${p.lang}:${q.quiz},\n`)
  //   fs.appendFileSync('quiz0.js', `${p.lang}:${q.quiz},\n`)
  //   console.log('end ', p.lang)
  // })
  await list.reduce(async (memo, p) => {
    await memo
    console.log('start ', p.lang)
    q = await parse(p.url)
    console.log('parse ', p.lang)
    // await fs.promises.appendFile('quiz0.js', `${p.lang}:${q.quiz},\n`)
    fs.appendFileSync('quiz0.js', `${p.lang}:${q.quiz},\n`)
    console.log('end ', p.lang)
  }, undefined)
  fs.appendFileSync('quiz0.js', `}\n`)
})
