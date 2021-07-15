const crypto = require("crypto");
const { promisify } = require("util");
const request = require("request");
const getRequest = promisify(request.get).bind(request);
const postRequest = promisify(request.post).bind(request);

const naver = {
  // service_id: 'ncp:sms:kr:259564686851:shuttleb',
  // secret: '8ebb37d94b1a420c9015242ac45459a7',
  service_id: "ncp:sms:kr:259564686851:shuttleb",
  access: "LSw8PW9yefRv3AHP0Crk", // API
  secret: "BxOvQeO4x6TNl2MLJENIt3WtKIp8yyeUNO1Zi8LG", // API
};

// const sms_base = 'https://sens.apigw.ntruss.com/sms/v2'
const sms_base = "https://sens.apigw.ntruss.com";

function createHeader(method, url) {
  const timestamp = new Date().getTime().toString();
  const hmac = crypto
    .createHmac("sha256", naver.secret)
    .update(`${method} ${url}\n${timestamp}\n${naver.access}`)
    .digest();
  // .update(method)
  // .update(" ")
  // .update(url)
  // .update("\n")
  // .update(timestamp)
  // .update("\n")
  // .update(naver.access)
  // .digest()
  // .digest("hex");
  // console.log(hmac)
  const buf = Buffer.from(hmac);
  return {
    ts: timestamp,
    key: naver.access,
    mac: buf.toString("base64"),
  };
}

// console.log(createHeader('GET', '/hello'))
function sms(phone, msg) {
  const url = `/sms/v2/services/${naver.service_id}/messages`;
  const calc = createHeader("POST", url);
  console.log(calc);
  postRequest({
    url: sms_base + url,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-ncp-apigw-timestamp": calc.ts,
      "x-ncp-iam-access-key": calc.key,
      "x-ncp-apigw-signature-v2": calc.mac,
    },
    body: JSON.stringify({
      type: "SMS",
      from: "0269540127",
      content: msg,
      messages: [
        {
          to: phone,
        },
      ],
    }),
  }).then((r) => {
    console.log(r);
  });
}

sms("01032886542");
