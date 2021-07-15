const mail = require('nodemailer')

const opt = {
  // // pool: true,    // use pool
  host: 'smtps.hiworks.com',
  port: 465,
  secure: true,
  // host: 'smtp.highworks.co.kr',
  // port: 587,
  // // secure: false,
  auth: {
    user: 'admin@shuttleb.com',
    pass: 'admin1210^^',
  },
}
let transporter = mail.createTransport(opt)

transporter.verify(function (error, success) {
  if (error) {
    console.log(error)
  } else {
    console.log('Server is ready to take our messages:', success)
    send()
  }
})

function send() {
  transporter
    .sendMail({
      from: 'admin@shuttleb.com',
      to: 'dhshin@highmaru.com',
      subject: 'Test',
      html: '<button>누르세요</button>',
      /*
    cc: 'aaa',
    bcc: 'aaa',
    text: 'aaa',
    attachments: [
          {   // utf-8 string as an attachment
              filename: 'text1.txt',
              content: 'hello world!'
          },
          {   // binary buffer as an attachment
              filename: 'text2.txt',
              content: new Buffer('hello world!','utf-8')
          },
          {   // file on disk as an attachment
              filename: 'text3.txt',
              path: '/path/to/file.txt' // stream this file
          },
          {   // filename and content type is derived from path
              path: '/path/to/file.txt'
          },
          {   // stream as an attachment
              filename: 'text4.txt',
              content: fs.createReadStream('file.txt')
          },
          {   // define custom content type for the attachment
              filename: 'text.bin',
              content: 'hello world!',
              contentType: 'text/plain'
          },
          {   // use URL as an attachment
              filename: 'license.txt',
              path: 'https://raw.github.com/nodemailer/nodemailer/master/LICENSE'
          },
          {   // encoded string as an attachment
              filename: 'text1.txt',
              content: 'aGVsbG8gd29ybGQh',
              encoding: 'base64'
          },
          {   // data uri as an attachment
              path: 'data:text/plain;base64,aGVsbG8gd29ybGQ='
          },
          {
              // use pregenerated MIME node
              raw: 'Content-Type: text/plain\r\n' +
                   'Content-Disposition: attachment;\r\n' +
                   '\r\n' +
                   'Hello world!'
          }
      ],
    
    */
    })
    .then((info) => {
      // console.log('Preview URL: ' + mail.getTestMessageUrl(info))
      console.log(info)
    })
}
