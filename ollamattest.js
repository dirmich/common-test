import { ChromaClient, DefaultEmbeddingFunction } from 'chromadb'
import docx from 'docx-parser'
import fs from 'fs'
import { createInterface } from 'node:readline/promises'
import { Ollama } from 'ollama'
import path from 'path'
import pdf from 'pdf-parse-fork'
// const ollama = new Ollama({ host: 'http://192.168.0.107:8000' })
const ollama = new Ollama({
  host: 'https://banana-taro-kowv1nlfipd0tqsw.salad.cloud/',
})
// const MODEL='ggml'
// const MODEL = 'solar-pro'
const MODEL = 'llama2'

const env = { client: null, collection: null }

const initDB = async () => {
  let client = new ChromaClient({ path: 'http://localhost:8000' })
  const collection = await client.getOrCreateCollection({
    name: 'test',
    metadata: {
      description: 'test',
      'hnsw:space': 'l2',
    },
    embeddingFunction: new DefaultEmbeddingFunction(),
  })
  env.client = client
  env.collection = collection
  //   return {
  //     client,
  //     collection,
  //   }
  //   addFilesToCollection('./ollama-ref', collection)
}
const queryCollection = async (queryTexts, nResults = 1) => {
  const result = await env.collection.query({
    nResults,
    queryTexts,
  })
  return result
}
function chunkText(text) {
  const words = text.split(/\s+/)
  const chunkSize = 100
  const chunks = []

  for (let i = 0; i < words.length; i += chunkSize) {
    const chunk = words.slice(i, i + chunkSize).join(' ')
    chunks.push(chunk)
  }

  return chunks
}

//PDF Parser
async function extractTextFromPDF(pdfPath) {
  const dataBuffer = fs.readFileSync(pdfPath)
  const pdfText = await pdf(dataBuffer)
  return pdfText.text
}

//Docx Parser
async function extractTextFromDocx(filePath) {
  return new Promise((resolve, reject) => {
    docx.parseDocx(filePath, function (data) {
      if (data) {
        resolve(data)
      } else {
        reject(new Error('No data returned from parseDocx'))
      }
    })
  })
}

// Chunk and add text to collection
export async function addTextToCollection(text, filePath, collection) {
  console.log(`Ingesting File ${filePath}\n...`)
  const chunks = chunkText(text)
  const fileName = filePath.split('/').pop() // Get PDF name from path
  const ids = chunks.map((_, index) => `${fileName}_chunk_${index + 1}`)
  const metadatas = chunks.map(() => ({ source: fileName }))

  const er1 = await collection.add({
    ids,
    metadatas,
    documents: chunks,
  })

  console.log(er1)
}

//Master Parser
export async function addFilesToCollection(folderPath, collection) {
  const files = fs.readdirSync(folderPath)

  for (const file of files) {
    const filePath = path.join(folderPath, file)
    if (path.extname(file).toLowerCase() === '.pdf') {
      const text = await extractTextFromPDF(filePath)
      await addTextToCollection(text, filePath, collection)
    } else if (path.extname(file).toLowerCase() === '.docx') {
      const text = await extractTextFromDocx(filePath)
      await addTextToCollection(text, filePath, collection)
    } else if (path.extname(file).toLowerCase() === '.txt') {
      const text = fs.readFileSync(filePath, 'utf8')
      await addTextToCollection(text, filePath, collection)
    } else continue
  }
}

const test = async () => {
  const r = await ollama.chat({
    model: MODEL,
    messages: [
      {
        role: 'user',
        content: '대한민국의 수도는? 그곳의 구경할 것은?',
      },
    ],
  })
  console.log(r)
}

const quest = async (content) => {
  const r = await ollama.chat({
    model: MODEL,
    messages: [
      {
        role: 'user',
        content,
      },
    ],
    stream: true,
  })
  for await (const part of r) {
    // console.log(part.message.content)
    process.stdout.write(part.message.content)
  }
}
// test2()

const test3 = async () => {
  process.stdin.resume()
  process.stdin.setEncoding('utf-8')
  let input = ''
  process.stdin.on('data', (str) => {
    input += str
    console.log('->', str)
  })
  process.stdin.on('end', () => {
    console.log('-->', input)
    process.stdout.write('-->' + input)
    input = ''
  })
  process.stdin.on('close', () => {
    console.log('end conversation')
  })
}

const input = async (prompt) => {
  const l = createInterface(process.stdin, process.stdout)
  const str = await l.question(prompt)
  l.close()
  return str
}

const getData = async (query) => {
  const fromdb = await ollama.embeddings({
    model: MODEL,
    prompt: query,
  })
  //   console.log('fromdb', fromdb)
  //   const r = await env.collection.query({
  //     queryEmbeddings: [fromdb.embedding],
  //     nResults: 1,
  //   })
  const r = await queryCollection(query)
  console.log('data', r)
  return r.documents[0][0]
}
const test4 = async () => {
  while (true) {
    const str = await input('-->')
    // const data = await getData(str)
    // const prompt = `Using this data:${data}. respond to this prompt:${str}. respond in korean.`
    const prompt = `respond to this prompt:${str}. respond in korean.`
    await quest(prompt)
  }
}
initDB()

test4()

/*
job title: react developer. based on the job title, please generate concise and complete summaries for my resume in JSON format, incorporating the follwing experience levels: fresher,mid, and experienced. Each summary should limited to 3 or 4 lines, reflecting a personal tone and showcasing specific relevant programming languages, technologies, frameworks, and methodologies without any placeholders or gaps. Ensure that the summaries are engaging and tailored to highlight unique strengths, aspirations, and contributions to collaborative projects, demonstrating a clear understanding of the role and industry standards.
*/
