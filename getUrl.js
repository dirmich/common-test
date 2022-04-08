const fetch = require('node-fetch')

const test = async (url) => {
  const opt = {
    method: 'GET',
  }

  return fetch(url, opt)
}

const test2 = async (url, cookie = null) => {
  const opt = {
    method: 'POST',
    body: '_dataset_=%7B%22IN_PARAM%22%3A%7B%22quickNo%22%3A%5B%22386705317076%22%5D%2C%22locale%22%3A%22ko%22%7D%7D',
  }

  if (cookie) {
    opt.headers = {
      cookie,
      Origin: 'http://www.epantos.com',
      Referer:
        'http://www.epantos.com/ecp/web/pr/dt/popup/dlvChaseInqPopup.do?locale=ko&quickNo=',
    }
  }
  return fetch(url, opt)
}

// test('http://www.epantos.com/ecp/pr/dt/dlvchaseinq/retreiveTrackingList.dev')
test(
  'http://www.epantos.com/ecp/web/pr/dt/popup/dlvChaseInqPopup.do?locale=ko&quickNo='
)
  .then(async (r) => {
    const cookie = r.headers.get('set-cookie')
    const tail = /(PSESSIONID=[^;]*);/.exec(cookie)[1]
    // console.log(/(PSESSIONID=[^;]*);/.exec(cookie))
    const ret = await test2(
      `http://www.epantos.com/ecp/pr/dt/dlvchaseinq/retreiveTrackingList.dev`,
      // `http://www.epantos.com/ecp/pr/dt/dlvchaseinq/retreiveTrackingList.dev;${tail}`,
      cookie
    )
    console.log(ret)
  })
  .catch((e) => console.log(e))
