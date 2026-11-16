import { readContentMarkdown, writeContentMarkdown } from './content-source'

const providers = {
  xai: {
    baseURL: 'https://api.x.ai/v1',
    model: 'grok-4',
  },
  mistral: {
    baseURL: 'https://api.mistral.ai/v1',
    model: 'mistral-small-latest',
  },
  local: {
    baseURL: '',
    model: '',
  },
} as const

export type TranslationProviderId = keyof typeof providers

const instructions = `You translate a Markdown document.
Return only the translated Markdown, with no commentary and no code fence around the whole document.
Keep YAML keys, slugs, dates, URLs, component names, MDC blocks (::Component, slots, props) and fenced code unchanged.
Translate human-readable text only.
Do not add or keep a _i18nSourceHash field.`

export function translationSetup() {
  const config = useRuntimeConfig()
  const id = String(config.translation.provider || 'xai') as TranslationProviderId
  const known = providers[id] ? id : 'xai'
  const preset = providers[known]
  return {
    id: known,
    baseURL: String(config.translation.baseURL || preset.baseURL),
    model: String(config.translation.model || preset.model),
    apiKey: String(config.translation.apiKey || ''),
  }
}

export async function translateMarkdown(input: {
  sourceLocale: 'fr' | 'en'
  targetLocale: 'fr' | 'en'
  markdown: string
}) {
  const setup = translationSetup()
  if (!setup.apiKey || !setup.baseURL || !setup.model) {
    throw createError({ statusCode: 409, statusMessage: 'missing-token' })
  }

  const result = await $fetch<{ choices?: { message?: { content?: string } }[] }>(`${setup.baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${setup.apiKey}`,
    },
    body: {
      model: setup.model,
      temperature: 0,
      messages: [
        { role: 'system', content: instructions },
        {
          role: 'user',
          content: `Translate from ${input.sourceLocale} to ${input.targetLocale}.\n\n${input.markdown}`,
        },
      ],
    },
  })

  const text = result.choices?.[0]?.message?.content?.trim() ?? ''
  if (!text) {
    throw createError({ statusCode: 502, statusMessage: 'translation-empty' })
  }
  return text.replace(/^```(?:markdown|md)?\n/, '').replace(/\n```$/, '')
}

export function draftFromTranslation(sourceMarkdown: string, translated: string) {
  const source = readContentMarkdown(sourceMarkdown)
  const proposal = translated.startsWith('---')
    ? readContentMarkdown(translated)
    : { frontmatter: source.frontmatter, body: translated }
  const frontmatter = { ...source.frontmatter, ...proposal.frontmatter }
  delete frontmatter._i18nSourceHash
  return {
    frontmatter,
    body: proposal.body,
    markdown: writeContentMarkdown(frontmatter, proposal.body),
  }
}
