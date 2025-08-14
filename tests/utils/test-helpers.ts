import { vi } from 'vitest'
import { join } from 'path'
import { writeFileSync, mkdirSync } from 'node:fs'

/**
 * Test utilities for translation script testing
 */

export interface MockContentFile {
  path: string
  content: string
  frontmatter?: Record<string, any>
}

export interface MockTranslationContext {
  technical_glossary?: Record<string, string>
  preserve_as_is?: string[]
  domain_context?: {
    primary_domain: string
    secondary_domains: string[]
    target_audience: string
    tone: string
  }
  translation_rules?: string[]
}

/**
 * Create a mock content file for testing
 */
export function createMockContentFile(options: {
  title: string
  content: string
  collection: 'articles' | 'projects'
  slug: string
  tags?: string[]
  date?: string
}): MockContentFile {
  const frontmatter = {
    title: options.title,
    date: options.date || '2024-01-01',
    tags: options.tags || [],
    ...options
  }

  const content = `---
title: "${frontmatter.title}"
date: "${frontmatter.date}"
tags: ${JSON.stringify(frontmatter.tags)}
---

${options.content}`

  return {
    path: `content/${options.collection}/${options.slug}.md`,
    content,
    frontmatter
  }
}

/**
 * Create a mock translation context for testing
 */
export function createMockTranslationContext(overrides?: Partial<MockTranslationContext>): MockTranslationContext {
  return {
    technical_glossary: {
      'JavaScript': 'JavaScript',
      'TypeScript': 'TypeScript',
      'frontend': 'frontend',
      'backend': 'backend',
      ...overrides?.technical_glossary
    },
    preserve_as_is: [
      'GitHub',
      'npm',
      'API',
      'JSON',
      'HTML',
      'CSS',
      ...overrides?.preserve_as_is || []
    ],
    domain_context: {
      primary_domain: 'Développement web',
      secondary_domains: ['Testing', 'DevOps'],
      target_audience: 'Développeurs',
      tone: 'Professionnel',
      ...overrides?.domain_context
    },
    translation_rules: [
      'Préserver les noms de technologies',
      'Maintenir la structure markdown',
      'Conserver les extraits de code',
      ...overrides?.translation_rules || []
    ]
  }
}

/**
 * Create a mock Mistral API response
 */
export function createMockMistralResponse(translatedContent: string) {
  return {
    ok: true,
    json: vi.fn().mockResolvedValue({
      choices: [{
        message: {
          content: translatedContent
        }
      }]
    })
  }
}

/**
 * Create a mock error response from Mistral API
 */
export function createMockMistralErrorResponse(status: number = 500, statusText: string = 'Internal Server Error') {
  return {
    ok: false,
    status,
    statusText
  }
}

/**
 * Mock file system operations for testing
 */
export function mockFileSystem() {
  const files = new Map<string, string>()
  const directories = new Set<string>()

  return {
    files,
    directories,

    mockReadFileSync: vi.fn((path: string) => {
      if (!files.has(path)) {
        throw new Error(`File not found: ${path}`)
      }
      return files.get(path)!
    }),

    mockWriteFileSync: vi.fn((path: string, content: string) => {
      files.set(path, content)
    }),

    mockExistsSync: vi.fn((path: string) => {
      return files.has(path) || directories.has(path)
    }),

    mockMkdirSync: vi.fn((path: string) => {
      directories.add(path)
    }),

    mockReaddirSync: vi.fn((path: string) => {
      const pathFiles = Array.from(files.keys())
        .filter(filePath => filePath.startsWith(path))
        .map(filePath => filePath.replace(path + '/', ''))
        .filter(fileName => !fileName.includes('/'))
      return pathFiles
    }),

    mockStatSync: vi.fn(() => ({
      isFile: () => true,
      isDirectory: () => false
    })),

    addFile: (path: string, content: string) => {
      files.set(path, content)
    },

    addDirectory: (path: string) => {
      directories.add(path)
    },

    clear: () => {
      files.clear()
      directories.clear()
    }
  }
}

/**
 * Create a test environment with temporary directories and files
 */
export function createTestEnvironment(testDir: string) {
  const contentDir = join(testDir, 'content')
  const articlesDir = join(contentDir, 'articles')
  const projectsDir = join(contentDir, 'projects')
  const frArticlesDir = join(contentDir, 'articles', 'fr')
  const frProjectsDir = join(contentDir, 'projects', 'fr')
  const scriptsDir = join(testDir, 'scripts')

  // Create directories
  mkdirSync(articlesDir, { recursive: true })
  mkdirSync(projectsDir, { recursive: true })
  mkdirSync(frArticlesDir, { recursive: true })
  mkdirSync(frProjectsDir, { recursive: true })
  mkdirSync(scriptsDir, { recursive: true })

  // Create translation context file
  const context = createMockTranslationContext()
  const contextPath = join(scriptsDir, 'translation-context.json')
  writeFileSync(contextPath, JSON.stringify(context, null, 2), 'utf-8')

  return {
    testDir,
    contentDir,
    articlesDir,
    projectsDir,
    frArticlesDir,
    frProjectsDir,
    scriptsDir,
    contextPath,

    addArticle: (slug: string, content: MockContentFile) => {
      const filePath = join(articlesDir, `${slug}.md`)
      writeFileSync(filePath, content.content, 'utf-8')
      return filePath
    },

    addProject: (slug: string, content: MockContentFile) => {
      const filePath = join(projectsDir, `${slug}.md`)
      writeFileSync(filePath, content.content, 'utf-8')
      return filePath
    },

    addTranslation: (collection: 'articles' | 'projects', slug: string, content: string) => {
      const dir = collection === 'articles' ? frArticlesDir : frProjectsDir
      const filePath = join(dir, `${slug}.md`)
      writeFileSync(filePath, content, 'utf-8')
      return filePath
    }
  }
}

/**
 * Assertion helpers for translation testing
 */
export const translationAssertions = {
  /**
   * Assert that content preserves code blocks
   */
  preservesCodeBlocks: (original: string, translated: string) => {
    const originalCodeBlocks = original.match(/```[\s\S]*?```/g) || []
    const translatedCodeBlocks = translated.match(/```[\s\S]*?```/g) || []

    expect(translatedCodeBlocks).toHaveLength(originalCodeBlocks.length)

    originalCodeBlocks.forEach((block, index) => {
      expect(translatedCodeBlocks[index]).toBe(block)
    })
  },

  /**
   * Assert that content preserves inline code
   */
  preservesInlineCode: (original: string, translated: string) => {
    const originalInlineCode = original.match(/`[^`]+`/g) || []
    const translatedInlineCode = translated.match(/`[^`]+`/g) || []

    expect(translatedInlineCode).toHaveLength(originalInlineCode.length)
  },

  /**
   * Assert that content preserves URLs
   */
  preservesUrls: (original: string, translated: string) => {
    const urlRegex = /https?:\/\/[^\s\)]+/g
    const originalUrls = original.match(urlRegex) || []
    const translatedUrls = translated.match(urlRegex) || []

    expect(translatedUrls).toHaveLength(originalUrls.length)
    originalUrls.forEach(url => {
      expect(translated).toContain(url)
    })
  },

  /**
   * Assert that content preserves markdown structure
   */
  preservesMarkdownStructure: (original: string, translated: string) => {
    // Check headers
    const originalHeaders = original.match(/^#+\s/gm) || []
    const translatedHeaders = translated.match(/^#+\s/gm) || []
    expect(translatedHeaders).toHaveLength(originalHeaders.length)

    // Check lists
    const originalLists = original.match(/^[\s]*[-*+]\s/gm) || []
    const translatedLists = translated.match(/^[\s]*[-*+]\s/gm) || []
    expect(translatedLists).toHaveLength(originalLists.length)
  },

  /**
   * Assert that frontmatter is properly updated
   */
  hasValidTranslationMetadata: (content: string, expectedHash?: string) => {
    expect(content).toContain('original_slug:')

    if (expectedHash) {
      expect(content).toContain(`source_content_hash: "${expectedHash}"`)
    }
  }
}

/**
 * Mock console methods for testing output
 */
export function mockConsole() {
  const originalConsole = { ...console }
  const logs: string[] = []
  const errors: string[] = []
  const warns: string[] = []

  const mockLog = vi.fn((...args: any[]) => {
    logs.push(args.join(' '))
  })

  const mockError = vi.fn((...args: any[]) => {
    errors.push(args.join(' '))
  })

  const mockWarn = vi.fn((...args: any[]) => {
    warns.push(args.join(' '))
  })

  console.log = mockLog
  console.error = mockError
  console.warn = mockWarn

  return {
    logs,
    errors,
    warns,
    mockLog,
    mockError,
    mockWarn,
    restore: () => {
      Object.assign(console, originalConsole)
    },
    clear: () => {
      logs.length = 0
      errors.length = 0
      warns.length = 0
    }
  }
}
