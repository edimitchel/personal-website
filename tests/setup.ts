// Global test setup for translation script testing
import { vi, beforeEach, afterEach } from 'vitest'
import { join } from 'path'

// Mock Node.js modules globally
vi.mock('node:fs', () => ({
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
  existsSync: vi.fn(),
  readdirSync: vi.fn(),
  statSync: vi.fn(),
  mkdirSync: vi.fn(),
  rmSync: vi.fn()
}))

vi.mock('gray-matter', () => ({
  default: vi.fn()
}))

vi.mock('c12', () => ({
  loadConfig: vi.fn().mockResolvedValue({ config: {} })
}))

// Global fetch mock
global.fetch = vi.fn()

// Global test environment setup
beforeEach(() => {
  // Reset all mocks before each test
  vi.clearAllMocks()
  
  // Set default test environment variables
  process.env.MISTRAL_API_KEY = 'test-api-key'
  process.env.TRANSLATOR_NAME = 'Test Translator'
  process.env.REVIEWER_NAME = 'Test Reviewer'
  process.env.NODE_ENV = 'test'
})

afterEach(() => {
  // Clean up after each test
  vi.resetAllMocks()
})

// Global test utilities
export const createMockTranslationFile = (options: {
  title: string
  content: string
  state?: 'draft' | 'current' | 'needs_review' | 'outdated' | 'approved' | 'missing'
  sourceHash?: string
}) => ({
  frontmatter: {
    title: options.title,
    translation_state: options.state || 'draft',
    source_content_hash: options.sourceHash || 'abc123',
    original_slug: options.title.toLowerCase().replace(/\s+/g, '-'),
    translated_by: 'Test Translator',
    translated_at: new Date().toISOString()
  },
  content: options.content
})

export const createMockApiResponse = (translatedContent: string) => ({
  ok: true,
  json: vi.fn().mockResolvedValue({
    choices: [{
      message: {
        content: translatedContent
      }
    }]
  })
})

export const createMockApiError = (status: number = 500) => ({
  ok: false,
  status,
  statusText: status === 429 ? 'Too Many Requests' : 'Internal Server Error'
})

// Suppress console output during tests unless explicitly testing it
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  info: vi.fn()
}