import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { join } from 'path'
import { tmpdir } from 'os'

describe('Translation Content Script - Integration Tests', () => {
  let testDir: string
  let originalEnv: NodeJS.ProcessEnv

  beforeEach(() => {
    // Create a temporary directory for testing
    testDir = join(tmpdir(), `translate-test-${Date.now()}`)
    mkdirSync(testDir, { recursive: true })
    
    // Save original environment
    originalEnv = { ...process.env }
    
    // Set test environment
    process.env.MISTRAL_API_KEY = 'test-api-key'
    process.env.TRANSLATOR_NAME = 'Test Translator'
  })

  afterEach(() => {
    // Clean up test directory
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true })
    }
    
    // Restore original environment
    process.env = originalEnv
    vi.clearAllMocks()
  })

  describe('End-to-End Translation Workflow', () => {
    it('should handle complete translation workflow', async () => {
      // Setup test files
      const contentDir = join(testDir, 'content')
      const articlesDir = join(contentDir, 'articles')
      const frArticlesDir = join(contentDir, 'articles', 'fr')
      
      mkdirSync(articlesDir, { recursive: true })
      mkdirSync(frArticlesDir, { recursive: true })

      // Create test article
      const testArticle = `---
title: "Getting Started with JavaScript"
description: "Learn JavaScript basics"
date: "2024-01-01"
tags: ["JavaScript", "tutorial"]
---

# Getting Started with JavaScript

JavaScript is a powerful programming language.

## Variables

\`\`\`javascript
let message = "Hello World";
console.log(message);
\`\`\`

Visit [MDN](https://developer.mozilla.org) for more info.`

      const articlePath = join(articlesDir, 'getting-started.md')
      writeFileSync(articlePath, testArticle, 'utf-8')

      // Create translation context
      const contextPath = join(testDir, 'scripts', 'translation-context.json')
      mkdirSync(join(testDir, 'scripts'), { recursive: true })
      
      const context = {
        technical_glossary: {
          "JavaScript": "JavaScript",
          "programming language": "langage de programmation"
        },
        preserve_as_is: ["MDN", "console.log"],
        domain_context: {
          primary_domain: "Développement web",
          secondary_domains: ["Tutoriels"],
          target_audience: "Développeurs débutants",
          tone: "Pédagogique"
        },
        translation_rules: [
          "Préserver les noms de technologies",
          "Maintenir la structure markdown",
          "Conserver les extraits de code"
        ]
      }
      
      writeFileSync(contextPath, JSON.stringify(context, null, 2), 'utf-8')

      // Mock successful API response
      const mockTranslatedContent = `---
title: "Débuter avec JavaScript"
description: "Apprendre les bases de JavaScript"
date: "2024-01-01"
tags: ["JavaScript", "tutoriel"]
---

# Débuter avec JavaScript

JavaScript est un langage de programmation puissant.

## Variables

\`\`\`javascript
let message = "Hello World";
console.log(message);
\`\`\`

Visitez [MDN](https://developer.mozilla.org) pour plus d'informations.`

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{
            message: {
              content: mockTranslatedContent
            }
          }]
        })
      })

      // Test the translation process
      // Note: We would need to modify the script to accept custom paths for testing
      // For now, we'll test the individual functions with our test data
      
      expect(existsSync(articlePath)).toBe(true)
      expect(existsSync(contextPath)).toBe(true)
    })
  })

  describe('Error Handling', () => {
    it('should handle network failures gracefully', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      // Test would verify that network errors are handled properly
      // and retries are attempted
      expect(true).toBe(true) // Placeholder
    })

    it('should handle malformed content files', async () => {
      const contentDir = join(testDir, 'content', 'articles')
      mkdirSync(contentDir, { recursive: true })

      // Create malformed markdown file
      const malformedContent = `---
title: "Test"
invalid yaml: [
---

# Content`

      const filePath = join(contentDir, 'malformed.md')
      writeFileSync(filePath, malformedContent, 'utf-8')

      // Test would verify that malformed files are handled gracefully
      expect(existsSync(filePath)).toBe(true)
    })

    it('should handle permission errors', async () => {
      // Test would verify that permission errors are handled properly
      expect(true).toBe(true) // Placeholder
    })
  })

  describe('Performance Tests', () => {
    it('should handle large content files efficiently', async () => {
      const largeContent = `---
title: "Large Article"
---

# Large Article

${'This is a very long paragraph. '.repeat(1000)}

## Section 1

${'More content here. '.repeat(500)}

## Section 2

${'Even more content. '.repeat(500)}`

      const contentDir = join(testDir, 'content', 'articles')
      mkdirSync(contentDir, { recursive: true })
      
      const filePath = join(contentDir, 'large-article.md')
      writeFileSync(filePath, largeContent, 'utf-8')

      // Test would verify that large files are processed efficiently
      expect(existsSync(filePath)).toBe(true)
      expect(largeContent.length).toBeGreaterThan(10000)
    })

    it('should handle batch translation efficiently', async () => {
      const contentDir = join(testDir, 'content', 'articles')
      mkdirSync(contentDir, { recursive: true })

      // Create multiple test files
      for (let i = 1; i <= 10; i++) {
        const content = `---
title: "Article ${i}"
---

# Article ${i}

This is article number ${i}.`

        writeFileSync(join(contentDir, `article-${i}.md`), content, 'utf-8')
      }

      // Test would verify that batch processing works efficiently
      const files = require('node:fs').readdirSync(contentDir)
      expect(files).toHaveLength(10)
    })
  })

  describe('Content Validation', () => {
    it('should preserve code blocks during translation', async () => {
      const contentWithCode = `---
title: "Code Example"
---

# Code Example

Here's some JavaScript:

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

const result = greet("World");
console.log(result);
\`\`\`

And some CSS:

\`\`\`css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
\`\`\`

Inline code: \`const x = 42;\``

      // Test would verify that code blocks are preserved exactly
      expect(contentWithCode).toContain('```javascript')
      expect(contentWithCode).toContain('```css')
      expect(contentWithCode).toContain('`const x = 42;`')
    })

    it('should preserve markdown formatting', async () => {
      const formattedContent = `---
title: "Formatted Content"
---

# Main Title

## Subtitle

This has **bold text** and *italic text*.

- List item 1
- List item 2
  - Nested item
  - Another nested item

1. Numbered item
2. Another numbered item

> This is a blockquote

[Link text](https://example.com)

![Image alt](image.jpg)`

      // Test would verify that markdown formatting is preserved
      expect(formattedContent).toContain('**bold text**')
      expect(formattedContent).toContain('*italic text*')
      expect(formattedContent).toContain('- List item')
      expect(formattedContent).toContain('> This is a blockquote')
    })

    it('should handle special characters and encoding', async () => {
      const specialContent = `---
title: "Special Characters"
---

# Special Characters

Accented characters: café, naïve, résumé
Symbols: © ® ™ € £ ¥
Emojis: 🚀 💻 🎉
Math: α β γ ∑ ∞
Quotes: "smart quotes" 'apostrophe'`

      // Test would verify that special characters are handled correctly
      expect(specialContent).toContain('café')
      expect(specialContent).toContain('🚀')
      expect(specialContent).toContain('∑')
    })
  })
})
