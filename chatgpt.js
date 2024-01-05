const fetch = require('node-fetch')

// OpenAI API Key
const apiKey = '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'

// API 요청 함수
async function requestChatGPT(prompt) {
  // API 엔드포인트
  const endpoint = 'https://api.openai.com/v1/engines/davinci-codex/completions'

  // API 요청 본문
  const requestBody = {
    prompt: prompt,
    max_tokens: 50,
    n: 1,
    stop: '\n',
  }

  // API 요청 헤더
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  }

  // API 요청 보내기
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(requestBody),
  })

  // API 응답 받기
  const json = await response.json()
  const text = json.choices[0].text.trim()

  // 결과 반환
  return text
}

// 챗봇 실행 함수
// |Good parts:
// |- The code uses an asynchronous function to handle user input and chatbot responses, which allows for a smoother and more responsive user experience.
// |- The code uses a while loop to continuously prompt the user for input until they enter the word "종료", which is a good way to handle user input in a chatbot scenario.
// |- The code uses the readline module to handle user input, which is a built-in module in Node.js and is a good choice for handling user input in a command-line interface.
// |
// |Bad parts:
// |- The code does not handle errors or invalid input from the user, which could cause the program to crash or behave unexpectedly.
// |- The code does not include any error handling for the requestChatGPT function, which could cause the program to crash or behave unexpectedly if there is an error in the chatbot API.
// |- The code does not include any validation or sanitization of user input, which could leave the program vulnerable to attacks such as SQL injection or cross-site scripting.
// |
async function runChatbot() {
  // 채팅 시작
  console.log('채팅을 시작합니다. 종료하려면 "종료"를 입력하세요.')

  // 사용자 입력 받기
  let userInput = ''
  while (userInput !== '종료') {
    // 사용자 입력 받기
    userInput = await new Promise((resolve, reject) => {
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
      })
      readline.question('> ', (input) => {
        readline.close()
        resolve(input)
      })
    })

    // 챗봇에게 입력 전달하기
    const prompt = `사용자: ${userInput}\n챗봇:`
    const response = await requestChatGPT(prompt)

    // 챗봇의 응답 출력하기
    console.log(response)
  }

  // 채팅 종료
  console.log('채팅을 종료합니다.')
}

// 챗봇 실행
// runChatbot()

function solution(data) {
  // function named solution that takes in a parameter called data
  let binaryStr = data.replace(/\+/g, '1').replace(/-/g, '0').replace(/ /g, '') // replace all + with 1, - with 0, and remove all spaces from the input string and store it in binaryStr variable
  let asciiStr = String.fromCharCode(parseInt(binaryStr, 2)) // convert binaryStr to decimal and then to its corresponding ASCII character and store it in asciiStr variable
  return asciiStr // return the asciiStr variable
}
console.log(solution('+--+-+-'))
