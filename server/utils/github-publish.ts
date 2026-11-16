import { decidePublish, type PublishDecision } from '~~/shared/admin/paths'

export type PublishState = {
  branch: string
  ready: boolean
  reason: PublishDecision
}

export function publishState(): PublishState {
  const config = useRuntimeConfig()
  const branch = String(config.github.branch ?? '')
  const token = String(config.githubToken ?? '')
  const reason = decidePublish({ branch, token })
  return {
    branch,
    ready: reason === 'ok',
    reason,
  }
}

export async function publishToGithub(relativePath: string, markdown: string) {
  const config = useRuntimeConfig()
  const state = publishState()
  if (state.reason === 'refused-branch') {
    throw createError({ statusCode: 403, statusMessage: 'refused-branch' })
  }
  if (state.reason === 'missing-token') {
    throw createError({ statusCode: 409, statusMessage: 'missing-token' })
  }

  const owner = String(config.github.owner ?? '')
  const repo = String(config.github.repo ?? '')
  const token = String(config.githubToken ?? '')
  const repoPath = `content/${relativePath}`
  const api = `https://api.github.com/repos/${owner}/${repo}/contents/${repoPath}`
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'personal-website-admin',
    'X-GitHub-Api-Version': '2022-11-28',
  }

  const existing = await $fetch.raw(api, {
    headers,
    query: { ref: state.branch },
    ignoreResponseError: true,
  })

  let sha: string | undefined
  if (existing.status === 200) {
    const payload = existing._data as { sha?: string }
    sha = payload.sha
  }
  else if (existing.status !== 404) {
    throw createError({ statusCode: 502, statusMessage: 'github-read-failed' })
  }

  const result = await $fetch.raw(api, {
    method: 'PUT',
    headers,
    body: {
      message: `content: ${relativePath}`,
      content: Buffer.from(markdown, 'utf8').toString('base64'),
      branch: state.branch,
      sha,
    },
    ignoreResponseError: true,
  })

  if (result.status !== 200 && result.status !== 201) {
    throw createError({ statusCode: 502, statusMessage: 'github-write-failed' })
  }

  return { branch: state.branch, path: repoPath }
}
