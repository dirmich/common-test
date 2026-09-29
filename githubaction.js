#!/usr/bin/env bun
import 'dotenv/config'
import { Octokit } from '@octokit/rest'
import sodium from 'libsodium-wrappers'

// --filename-- .env (GITHUB_TOKEN, GITHUB_USER, DEV_*, MAIN_*, DOCKERHUB_*)
const API_VERSION = '2022-11-28'
const usage = 'Usage: bun githubaction.js <dev|prod> <projectname>'

function fail(message) {
  console.error(message)
  process.exitCode = 1
}

function requiredEnv(name) {
  const value = process.env[name]
  if (!value || !value.trim()) throw new Error(`Set ${name} in .env.`)
  return value
}

function buildSecrets(environment) {
  const isDev = environment === 'dev'
  const prefix = isDev ? 'DEV' : 'MAIN'
  const secrets = {
    DOCKERHUB_USERNAME: requiredEnv('DOCKERHUB_USERNAME'),
    DOCKERHUB_TOKEN: requiredEnv('DOCKERHUB_TOKEN'),
    AWS_SSH_HOST: requiredEnv(`${prefix}_HOST`),
    AWS_SSH_USER: requiredEnv(`${prefix}_USER`),
    AWS_SSH_PORT: requiredEnv(`${prefix}_PORT`),
  }
  secrets[isDev ? 'AWS_SSH_PASS' : 'AWS_SSH_KEY'] = requiredEnv(isDev ? 'DEV_PASS' : 'MAIN_KEY')
  return secrets
}

function buildVariables(project) {
  const namespace = process.env.DOCKERHUB_NAMESPACE || 'dirmich'
  if (!/^[A-Za-z0-9_.-]+$/.test(namespace)) throw new Error('DOCKERHUB_NAMESPACE contains invalid characters.')
  return {
    DOCKER_REPOSITORY: `${namespace}/${project}b`,
    DOCKER_FRONT_REPOSITORY: `${namespace}/${project}`,
  }
}

async function putSecret(octokit, owner, repo, name, value, key, keyId) {
  await sodium.ready
  const publicKey = sodium.from_base64(key, sodium.base64_variants.ORIGINAL)
  const encrypted = sodium.crypto_box_seal(sodium.from_string(value), publicKey)
  await octokit.request('PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}', {
    owner, repo, secret_name: name,
    encrypted_value: sodium.to_base64(encrypted, sodium.base64_variants.ORIGINAL),
    key_id: keyId, headers: { 'X-GitHub-Api-Version': API_VERSION },
  })
}

async function upsertVariable(octokit, owner, repo, name, value) {
  const request = { owner, repo, name, value, headers: { 'X-GitHub-Api-Version': API_VERSION } }
  try {
    await octokit.request('PATCH /repos/{owner}/{repo}/actions/variables/{name}', request)
  } catch (error) {
    if (error.status !== 404) throw error
    await octokit.request('POST /repos/{owner}/{repo}/actions/variables', request)
  }
}

async function main() {
  const [, , environment, project] = process.argv
  if (!['dev', 'prod'].includes(environment) || !project || process.argv.length !== 4) {
    console.error(usage)
    process.exitCode = 2
    return
  }
  if (!/^[A-Za-z0-9_.-]+$/.test(project)) throw new Error('projectname contains invalid characters.')
  const owner = process.env.GITHUB_USER
  const token = process.env.GITHUB_TOKEN
  if (!owner || !token) throw new Error('Set GITHUB_USER and GITHUB_TOKEN in .env.')
  const secrets = buildSecrets(environment)
  const variables = buildVariables(project)
  const octokit = new Octokit({ auth: token })
  const { data: publicKey } = await octokit.actions.getRepoPublicKey({ owner, repo: project })
  for (const [name, value] of Object.entries(secrets)) {
    await putSecret(octokit, owner, project, name, value, publicKey.key, publicKey.key_id)
    console.log(`Secret updated: ${name}`)
  }
  for (const [name, value] of Object.entries(variables)) {
    await upsertVariable(octokit, owner, project, name, value)
    console.log(`Variable updated: ${name}`)
  }
  console.log(`Done: ${owner}/${project} (${environment})`)
}

main().catch((error) => fail(`GitHub Actions update failed: ${error.message}`))
