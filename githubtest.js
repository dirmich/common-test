import { Octokit } from "@octokit/rest"
import "dotenv/config"
import sodium from "libsodium-wrappers"
// const { Octokit } = require('@octokit/rest')
// require('dotenv').config()
// const sodium = require('libsodium-wrappers')

// const PROJECT = 'dangol-front'
// const PROJECT = 'dangol-server'
// const PROJECT = "strava_clone"
// const PROJECT = "silverlatte-v1"
// const PROJECT = "walkfit"
// const PROJECT = "maruprompt"
// const PROJECT = "marutalk"
const PROJECT = "marumodel"
// const secrets = {
//   DOCKERHUB_USERNAME: "dirmich",
//   DOCKERHUB_TOKEN: "dustjdi00",
//   AWS_SSH_HOST: "highmaru.com",
//   AWS_SSH_USER: "dirmich",
//   AWS_SSH_PASS: "dmswjddl",
//   AWS_SSH_PORT: "12369"
// }

const secrets = {
  DOCKERHUB_USERNAME: "dirmich",
  DOCKERHUB_TOKEN: "dustjdi00",
  AWS_SSH_HOST: "lab.highmaru.com",
  AWS_SSH_USER: "dirmich",
  AWS_SSH_PASS: "dmswjddl",
  AWS_SSH_PORT: "22"
}
const variables = {
  DOCKER_REPOSITORY: `dirmich/${PROJECT}b`,
  DOCKER_FRONT_REPOSITORY: `dirmich/${PROJECT}`
}
// acs
// const PROJECT = 'project-acs-frontend-v3.5'
// // const PROJECT = 'project-acs-backend-v3.5'
// const secrets = {
//   AWS_SSH_HOST: 'ics.lab.highmaru.com',
//   AWS_SSH_USER: 'ec2-user',
//   AWS_SSH_PORT: 22,
//   AWS_SSH_KEY:
//     '-----BEGIN OPENSSH PRIVATE KEY-----\r\n' +
//     'b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtz\r\n' +
//     'c2gtZWQyNTUxOQAAACCD/Y5s2ksqlNJsQTdBi6trtPaEdswM4Z+pEAIPwxkh7QAA\r\n' +
//     'AIiGs8zchrPM3AAAAAtzc2gtZWQyNTUxOQAAACCD/Y5s2ksqlNJsQTdBi6trtPaE\r\n' +
//     'dswM4Z+pEAIPwxkh7QAAAEAwUQIBATAFBgMrZXAEIgQg2p0foVwVSxg4lAgL4Hap\r\n' +
//     '6oP9jmzaSyqU0mxBN0GLq2u09oR2zAzhn6kQAg/DGSHtAAAAAAECAwQF\r\n' +
//     '-----END OPENSSH PRIVATE KEY-----',
// }
// const variables = {}
// ////////
// // ucs
// const PROJECT = 'project-ws-backend-v3.5'
// const secrets = {
//   AWS_SSH_HOST: 'ws.lab.highmaru.com',
//   AWS_SSH_USER: 'ec2-user',
//   AWS_SSH_KEY:
//     '-----BEGIN OPENSSH PRIVATE KEY-----\r\n' +
//     'b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtz\r\n' +
//     'c2gtZWQyNTUxOQAAACCD/Y5s2ksqlNJsQTdBi6trtPaEdswM4Z+pEAIPwxkh7QAA\r\n' +
//     'AIiGs8zchrPM3AAAAAtzc2gtZWQyNTUxOQAAACCD/Y5s2ksqlNJsQTdBi6trtPaE\r\n' +
//     'dswM4Z+pEAIPwxkh7QAAAEAwUQIBATAFBgMrZXAEIgQg2p0foVwVSxg4lAgL4Hap\r\n' +
//     '6oP9jmzaSyqU0mxBN0GLq2u09oR2zAzhn6kQAg/DGSHtAAAAAAECAwQF\r\n' +
//     '-----END OPENSSH PRIVATE KEY-----',
// }
// const variables = {}
// ////////
// // ucs
// const PROJECT = 'project-ucs-backend-v3.5'
// const secrets = {
//   AWS_SSH_HOST: 'lab.highmaru.com',
//   AWS_SSH_USER: 'dirmich',
//   AWS_SSH_PASS: 'dmswjddl',
//   AWS_SSH_PORT: '22',
// }
// const variables = {}
// ////////

console.log("PROJECT:", process.env.GITHUB_TOKEN,process.env.GITHUB_USER, PROJECT)
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
})
// ;(async () => {
//   const {
//     data: { key, key_id }
//   } = await octokit.actions.getRepoPublicKey({
//     owner: process.env.GITHUB_USER,
//     repo: PROJECT
//   })
//   console.log(PROJECT)
//   console.log("register secrets")
//   Object.keys(secrets).map(async (item) => {
//     const val = secrets[item]
//     await sodium.ready

//     const binkey = sodium.from_base64(key, sodium.base64_variants.ORIGINAL)
//     const binsec = sodium.from_string(val)
//     const enc = sodium.crypto_box_seal(binsec, binkey)
//     const encval = sodium.to_base64(enc, sodium.base64_variants.ORIGINAL)
//     await octokit.request(
//       `PUT /repos/${process.env.GITHUB_USER}/${PROJECT}/actions/secrets/${item}`,
//       {
//         owner: process.env.GITHUB_USER,
//         repo: PROJECT,
//         secret_name: item,
//         encrypted_value: encval,
//         key_id,
//         headers: {
//           "X-GitHub-Api-Version": "2022-11-28"
//         }
//       }
//     )
//   })
//   console.log("register variables")
//   Object.keys(variables).map(async (item) => {
//     const val = variables[item]

//     await octokit.request(
//       // `POST /repos/${process.env.GITHUB_USER}/${PROJECT}/actions/variables`,
//       `PUT /repos/${process.env.GITHUB_USER}/${PROJECT}/actions/variables/${item}`,
//       {
//         owner: process.env.GITHUB_USER,
//         repo: PROJECT,
//         environment_name: "actions",
//         name: item,
//         value: val,
//         headers: {
//           "X-GitHub-Api-Version": "2022-11-28"
//         }
//       }
//     )
//   })
//   console.log("done")
// })()
;(async () => {
  // 1. Public Key 가져오기
  const {
    data: { key, key_id }
  } = await octokit.actions.getRepoPublicKey({
    owner: process.env.GITHUB_USER,
    repo: PROJECT
  })

  console.log(PROJECT)
  console.log("register secrets")

  // 2. Secrets 등록 (Promise.all 사용)
  const secretPromises = Object.keys(secrets).map(async (item) => {
    const val = secrets[item]
    await sodium.ready

    const binkey = sodium.from_base64(key, sodium.base64_variants.ORIGINAL)
    const binsec = sodium.from_string(val)
    const enc = sodium.crypto_box_seal(binsec, binkey)
    const encval = sodium.to_base64(enc, sodium.base64_variants.ORIGINAL)

    return octokit.request(
      `PUT /repos/${process.env.GITHUB_USER}/${PROJECT}/actions/secrets/${item}`,
      {
        owner: process.env.GITHUB_USER,
        repo: PROJECT,
        secret_name: item,
        encrypted_value: encval,
        key_id,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28"
        }
      }
    )
  })
  await Promise.all(secretPromises)

  console.log("register variables")

  // 3. Variables 등록 (Promise.all 사용)
  const variablePromises = Object.keys(variables).map(async (item) => {
    const val = variables[item]
    try {
      octokit.request(
      `PUT /repos/${process.env.GITHUB_USER}/${PROJECT}/actions/variables/${item}`,
      {
        owner: process.env.GITHUB_USER,
        repo: PROJECT,
        name: item,
        value: encval,
        key_id,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28"
        }
      }
    )
      // octokit.request(
      //   `PATCH /repos/${process.env.GITHUB_USER}/${PROJECT}/actions/variables/${item}`,
      //   {
      //     owner: process.env.GITHUB_USER,
      //     repo: PROJECT,
      //     name: item,
      //     value: val,
      //     headers: {
      //       "X-GitHub-Api-Version": "2022-11-28"
      //     }
      //   }
      // )
      
      
    } catch (e) {
      console.log("Variable not found, creating new one:", item)
      octokit.request(
        `POST /repos/${process.env.GITHUB_USER}/${PROJECT}/actions/variables`,
        {
          owner: process.env.GITHUB_USER,
          repo: PROJECT,
          name: item,
          value: val,
          headers: {
            "X-GitHub-Api-Version": "2022-11-28"
          }
        }
      )
    }
  })
  await Promise.all(variablePromises)

  console.log("done")
})()
