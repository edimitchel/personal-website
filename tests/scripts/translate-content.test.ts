import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync, rmSync } from 'node:fs'
import { join } from 'path'
import matter from 'gray-matter'

// Mock the modules
vi.mock('node:fs')
vi.mock('gray-matter')
vi.mock('c12', () => ({
  loadConfig: vi.fn().mockResolvedValue({ config: {} })
}))

// Mock fetch for API calls
global.fetch = vi.fn()

// Import the functions we want to test
// Since the script uses top-level await, we'll need to import the functions directly
const mockReadFileSync = vi.mocked(readFileSync)
const mockWriteFileSync = vi.mocked(writeFileSync)
const mockExistsSync = vi.mocked(existsSync)
const mockReaddirSync = vi.mocked(readdirSync)
const mockStatSync = vi.mocked(statSync)
const mockMatter = vi.mocked(matter)
const mockMkdirSync = vi.mocked(mkdirSync)
// Mock matter.stringify as well
const mockMatterStringify = vi.fn()
mockMatter.stringify = mockMatterStringify

describe('Translation Content Script', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Set up default environment
    process.env.MISTRAL_API_KEY = 'test-api-key'
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('loadTranslationContext', () => {
    it('should load translation context successfully', async () => {
      const mockContext = {
        technical_glossary: { 'JavaScript': 'JavaScript' },
        preserve_as_is: ['GitHub'],
        domain_context: {
          primary_domain: 'Web Development',
          secondary_domains: ['Testing'],
          target_audience: 'Developers',
          tone: 'Professional'
        },
        translation_rules: ['Preserve tech names']
      }

      mockReadFileSync.mockReturnValue(JSON.stringify(mockContext))
      mockExistsSync.mockReturnValue(true)

      // We need to dynamically import to test the function
      const { loadTranslationContext } = await import('../../scripts/translate-content-lib.js')
      const result = loadTranslationContext()

      expect(result).toEqual(mockContext)
      expect(mockReadFileSync).toHaveBeenCalledWith(
        expect.stringContaining('translation-context.json'),
        'utf-8'
      )
    })

    it('should handle missing translation context file', async () => {
      mockReadFileSync.mockImplementation(() => {
        throw new Error('File not found')
      })

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('Process exit called')
      })

      const { loadTranslationContext } = await import('../../scripts/translate-content-lib.js')
      
      expect(() => loadTranslationContext()).toThrow('Process exit called')
      expect(consoleSpy).toHaveBeenCalledWith('❌ Failed to load translation context:', expect.any(Error))
      expect(processExitSpy).toHaveBeenCalledWith(1)

      consoleSpy.mockRestore()
      processExitSpy.mockRestore()
    })
  })

  describe('calculateContentHash', () => {
    it('should generate consistent hash for same content', async () => {
      const { calculateContentHash } = await import('../../scripts/translate-content-lib.js')
      
      const content = 'Test content'
      const hash1 = calculateContentHash(content)
      const hash2 = calculateContentHash(content)

      expect(hash1).toBe(hash2)
      expect(hash1).toMatch(/^[a-f0-9]{32}$/) // MD5 hash format
    })

    it('should generate different hashes for different content', async () => {
      const { calculateContentHash } = await import('../../scripts/translate-content-lib.js')
      
      const hash1 = calculateContentHash('Content 1')
      const hash2 = calculateContentHash('Content 2')

      expect(hash1).not.toBe(hash2)
    })
  })

  describe('getContentFiles', () => {
    it('should get all content files from specified collections', async () => {
      const mockFileContent = `---
title: "Test Article"
---
# Test Content`

      const mockParsedMatter = {
        data: { title: 'Test Article' },
        content: '# Test Content'
      }

      mockExistsSync.mockReturnValue(true)
      mockReaddirSync.mockReturnValue(['test-article.md', 'another-file.txt'] as any)
      mockStatSync.mockReturnValue({ isFile: () => true } as any)
      mockReadFileSync.mockReturnValue(mockFileContent)
      mockMatter.mockReturnValue({
        ...mockParsedMatter,
        orig: mockFileContent,
        language: '',
        matter: '',
        stringify: () => mockFileContent
      } as any)

      const { getContentFiles } = await import('../../scripts/translate-content-lib.js')
      const files = getContentFiles('articles')

      expect(files).toHaveLength(1) // Only .md files should be included
      expect(files[0]).toMatchObject({
        collection: 'articles',
        slug: 'test-article',
        content: mockFileContent,
        frontmatter: mockParsedMatter.data
      })
    })

    it('should handle missing collection directory', async () => {
      mockExistsSync.mockReturnValue(false)
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const { getContentFiles } = await import('../../scripts/translate-content-lib.js')
      const files = getContentFiles('nonexistent')

      expect(files).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Collection directory not found')
      )

      consoleSpy.mockRestore()
    })
  })

  describe('getFrenchPath', () => {
    it('should generate correct French translation path', async () => {
      const { getFrenchPath } = await import('../../scripts/translate-content-lib.js')
      
      const originalPath = '/path/to/content/articles/test.md'
      const frenchPath = getFrenchPath(originalPath)

      expect(frenchPath).toContain('articles/fr/test.md')
    })
  })

  describe('getTranslationStatus', () => {
    it('should return missing status when translation does not exist', async () => {
      mockExistsSync.mockReturnValue(false)

      const { getTranslationStatus } = await import('../../scripts/translate-content-lib.js')
      
      const mockFile = {
        path: '/content/articles/test.md',
        relativePath: 'content/articles/test.md',
        collection: 'articles',
        slug: 'test',
        content: 'test content',
        frontmatter: {},
        hash: 'abc123'
      }

      const status = getTranslationStatus(mockFile)

      expect(status.state).toBe('missing')
      expect(status.currentHash).toBe('abc123')
    })

    it('should return current status when translation is up to date', async () => {
      const mockTranslationContent = `---
title: "Test Traduit"
translation_state: "current"
source_content_hash: "abc123"
---
# Contenu de test`

      const mockParsedTranslation = {
        data: {
          title: 'Test Traduit',
          translation_state: 'current',
          source_content_hash: 'abc123'
        },
        content: '# Contenu de test',
        orig: mockTranslationContent,
        language: '',
        matter: '',
        stringify: () => mockTranslationContent
      }

      mockExistsSync.mockReturnValue(true)
      mockReadFileSync.mockReturnValue(mockTranslationContent)
      mockMatter.mockReturnValue(mockParsedTranslation)

      const { getTranslationStatus } = await import('../../scripts/translate-content-lib.js')
      
      const mockFile = {
        path: '/content/articles/test.md',
        relativePath: 'content/articles/test.md',
        collection: 'articles',
        slug: 'test',
        content: 'test content',
        frontmatter: {},
        hash: 'abc123'
      }

      const status = getTranslationStatus(mockFile)

      expect(status.state).toBe('current')
      expect(status.sourceHash).toBe('abc123')
    })

    it('should return outdated status when source content has changed', async () => {
      const mockTranslationContent = `---
title: "Test Traduit"
translation_state: "current"
source_content_hash: "old123"
---
# Contenu de test`

      const mockParsedTranslation = {
        data: {
          title: 'Test Traduit',
          translation_state: 'current',
          source_content_hash: 'old123'
        },
        content: '# Contenu de test',
        orig: mockTranslationContent,
        language: '',
        matter: '',
        stringify: () => mockTranslationContent
      }

      mockExistsSync.mockReturnValue(true)
      mockReadFileSync.mockReturnValue(mockTranslationContent)
      mockMatter.mockReturnValue(mockParsedTranslation)

      const { getTranslationStatus } = await import('../../scripts/translate-content-lib.js')
      
      const mockFile = {
        path: '/content/articles/test.md',
        relativePath: 'content/articles/test.md',
        collection: 'articles',
        slug: 'test',
        content: 'test content',
        frontmatter: {},
        hash: 'new123' // Different hash indicates content changed
      }

      const status = getTranslationStatus(mockFile)

      expect(status.state).toBe('outdated')
      expect(status.sourceHash).toBe('old123')
      expect(status.currentHash).toBe('new123')
    })
  })

  describe('createTranslationPrompt', () => {
    it('should create a proper translation prompt', async () => {
      const mockContext = {
        technical_glossary: { 'JavaScript': 'JavaScript' },
        preserve_as_is: ['GitHub', 'API'],
        domain_context: {
          primary_domain: 'Web Development',
          secondary_domains: ['Testing'],
          target_audience: 'Developers',
          tone: 'Professional'
        },
        translation_rules: ['Preserve tech names', 'Maintain markdown']
      }

      const { createTranslationPrompt } = await import('../../scripts/translate-content-lib.js')
      
      const content = '# Test Article\n\nThis is about JavaScript and GitHub.'
      const prompt = createTranslationPrompt(content, mockContext)

      expect(prompt).toContain('Traduire le contenu technique suivant de l\'anglais au français.')
      expect(prompt).toContain('Web Development')
      expect(prompt).toContain('JavaScript')
      expect(prompt).toContain('GitHub')
      expect(prompt).toContain('Preserve tech names')
      expect(prompt).toContain(content)
    })
  })

  describe('translateWithMistral', () => {
    it('should successfully translate content using Mistral API', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          choices: [{
            message: {
              content: '# Article de Test\n\nCeci concerne JavaScript et GitHub.'
            }
          }]
        })
      }

      global.fetch = vi.fn().mockResolvedValue(mockResponse)

      const mockContext = {
        technical_glossary: { 'JavaScript': 'JavaScript' },
        preserve_as_is: ['GitHub'],
        domain_context: {
          primary_domain: 'Web Development',
          secondary_domains: [],
          target_audience: 'Developers',
          tone: 'Professional'
        },
        translation_rules: []
      }

      const { translateWithMistral } = await import('../../scripts/translate-content-lib.js')
      
      const content = '# Test Article\n\nThis is about JavaScript and GitHub.'
      const result = await translateWithMistral(content, mockContext)

      expect(result).toBe('# Article de Test\n\nCeci concerne JavaScript et GitHub.')
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.mistral.ai/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-api-key',
            'Content-Type': 'application/json'
          })
        })
      )
    })

    it('should handle API errors with retries', async () => {
      const mockErrorResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      }

      global.fetch = vi.fn().mockResolvedValue(mockErrorResponse)

      const { translateWithMistral } = await import('../../scripts/translate-content-lib.js')
      
      const content = 'Test content'
      
      await expect(translateWithMistral(content, {
        technical_glossary: {},
        preserve_as_is: [],
        domain_context: {
          primary_domain: 'Web Development',
          secondary_domains: [],
          target_audience: 'Developers',
          tone: 'Professional'
        },
        translation_rules: []
      })).rejects.toThrow('Translation failed after 3 retries')
      
      expect(global.fetch).toHaveBeenCalledTimes(3) // Should retry 3 times
    }, 10000)

    it('should handle missing API key', async () => {
      delete process.env.MISTRAL_API_KEY

      const mockContext = {
        technical_glossary: {},
        preserve_as_is: [],
        domain_context: {
          primary_domain: 'Web Development',
          secondary_domains: [],
          target_audience: 'Developers',
          tone: 'Professional'
        },
        translation_rules: []
      }

      const { translateWithMistral } = await import('../../scripts/translate-content-lib.js')
      
      await expect(translateWithMistral('test', mockContext)).rejects.toThrow(
        'MISTRAL_API_KEY environment variable is required'
      )
    })
  })

  describe('saveTranslation', () => {
    it('should save translation with proper metadata', async () => {
      const mockOriginalFile = {
        path: '/content/articles/test.md',
        relativePath: 'content/articles/test.md',
        collection: 'articles',
        slug: 'test',
        content: 'original content',
        frontmatter: { title: 'Test' },
        hash: 'abc123'
      }

      const translatedContent = `---
title: "Test Traduit"
---
# Contenu traduit`

      // Mock existsSync to return false for translation file (so it can be created)
      // but also false for directory (so mkdirSync gets called)
      mockExistsSync.mockImplementation((path: any) => {
        // Return false for both the translation file and its directory
        return false
      })
      // Reset the mkdirSync mock
      mockMkdirSync.mockImplementation(() => undefined)
      
      // Mock matter to parse the translated content
      mockMatter.mockReturnValue({
        data: { title: 'Test Traduit' },
        content: '# Contenu traduit',
        orig: translatedContent,
        language: '',
        matter: '',
        stringify: () => translatedContent
      })
      
      // Mock matter.stringify to return the expected content with metadata
      mockMatterStringify.mockReturnValue(`---
title: "Test Traduit"
translation_state: "draft"
original_slug: "test"
source_content_hash: "abc123"
translated_by: "AI Translator"
translated_at: "2023-01-01T00:00:00.000Z"
last_updated: "2023-01-01T00:00:00.000Z"
---
# Contenu traduit`)

      const { saveTranslation } = await import('../../scripts/translate-content-lib.js')
      
      saveTranslation(mockOriginalFile, translatedContent)

      expect(mockMkdirSync).toHaveBeenCalled() // Should create directory
      expect(mockWriteFileSync).toHaveBeenCalledWith(
        expect.stringContaining('articles/fr/test.md'),
        expect.stringContaining('source_content_hash: "abc123"'),
        'utf-8'
      )
    })

    it('should not overwrite existing translation without force flag', async () => {
      mockExistsSync.mockReturnValue(true) // Translation already exists

      const mockOriginalFile = {
        path: '/content/articles/test.md',
        relativePath: 'content/articles/test.md',
        collection: 'articles',
        slug: 'test',
        content: 'original content',
        frontmatter: { title: 'Test' },
        hash: 'abc123'
      }

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const { saveTranslation } = await import('../../scripts/translate-content-lib.js')
      
      saveTranslation(mockOriginalFile, 'translated content', false)

      expect(mockWriteFileSync).not.toHaveBeenCalled()
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Translation already exists')
      )

      consoleSpy.mockRestore()
    })
  })

  describe('updateTranslationStatus', () => {
    it('should update translation status to outdated when source changes', async () => {
      const mockTranslationContent = `---
title: "Test Traduit"
translation_state: "current"
source_content_hash: "old123"
---
# Contenu traduit`

      const mockParsedTranslation = {
        data: {
          title: 'Test Traduit',
          translation_state: 'current',
          source_content_hash: 'old123'
        },
        content: '# Contenu traduit',
        orig: mockTranslationContent,
        language: '',
        matter: '',
        stringify: () => mockTranslationContent
      }

      mockExistsSync.mockReturnValue(true)
      mockReadFileSync.mockReturnValue(mockTranslationContent)
      mockMatter.mockReturnValue(mockParsedTranslation)
      mockMatterStringify.mockReturnValue(`---
title: "Test Traduit"
translation_state: "outdated"
source_content_hash: "new123"
last_updated: "2023-01-01T00:00:00.000Z"
---
# Contenu traduit`)

      const mockOriginalFile = {
        path: '/content/articles/test.md',
        relativePath: 'content/articles/test.md',
        collection: 'articles',
        slug: 'test',
        content: 'updated original content',
        frontmatter: { title: 'Test' },
        hash: 'new123'
      }

      const { updateTranslationStatus } = await import('../../scripts/translate-content-lib.js')
      
      updateTranslationStatus(mockOriginalFile)

      expect(mockWriteFileSync).toHaveBeenCalledWith(
        expect.stringContaining('articles/fr/test.md'),
        expect.stringContaining('translation_state: "outdated"'),
        'utf-8'
      )
    })

    it('should not update status if translation does not exist', async () => {
      mockExistsSync.mockReturnValue(false)

      const mockOriginalFile = {
        path: '/content/articles/test.md',
        relativePath: 'content/articles/test.md',
        collection: 'articles',
        slug: 'test',
        content: 'content',
        frontmatter: { title: 'Test' },
        hash: 'abc123'
      }

      const { updateTranslationStatus } = await import('../../scripts/translate-content-lib.js')
      
      updateTranslationStatus(mockOriginalFile)

      expect(mockWriteFileSync).not.toHaveBeenCalled()
    })
  })

  describe('publishTranslation', () => {
    it('should publish translation by updating metadata', async () => {
      const mockTranslationContent = `---
title: "Test Traduit"
translation_state: "draft"
---
# Contenu traduit`

      const mockParsedTranslation = {
        data: {
          title: 'Test Traduit',
          translation_state: 'draft'
        },
        content: '# Contenu traduit',
        orig: mockTranslationContent,
        language: '',
        matter: '',
        stringify: () => mockTranslationContent
      }

      mockExistsSync.mockReturnValue(true)
      mockReadFileSync.mockReturnValue(mockTranslationContent)
      mockMatter.mockReturnValue(mockParsedTranslation)
      mockMatterStringify.mockReturnValue(`---
title: "Test Traduit"
translation_state: "approved"
reviewed_by: "Content Reviewer"
reviewed_at: "2023-01-01T00:00:00.000Z"
published_at: "2023-01-01T00:00:00.000Z"
---
# Contenu traduit`)

      const { publishTranslation } = await import('../../scripts/translate-content-lib.js')
      
      publishTranslation('articles', 'test.md')

      expect(mockWriteFileSync).toHaveBeenCalledWith(
        expect.stringContaining('articles/fr/test.md'),
        expect.stringContaining('translation_state: "approved"'),
        'utf-8'
      )
    })

    it('should handle missing translation file', async () => {
      mockExistsSync.mockReturnValue(false)

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const { publishTranslation } = await import('../../scripts/translate-content-lib.js')
      
      publishTranslation('articles', 'nonexistent.md')

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Translation not found')
      )
      expect(mockWriteFileSync).not.toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })
})
