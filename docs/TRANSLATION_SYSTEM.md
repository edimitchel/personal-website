# 🌐 AI Translation System Documentation

## Overview

This project includes a comprehensive AI-powered translation system that automatically translates English content to French using Mistral AI's Codestral model. The system is designed for technical content with specialized terminology and maintains high translation quality through context-aware prompts and metadata tracking.

## Architecture

### Hybrid Folder Structure
- **English content** (source): `content/articles/`, `content/projects/`
- **French translations**: `content/articles/fr/`, `content/projects/fr/`
- **Separate collections**: `articles`, `projects`, `articles-fr`, `projects-fr`

### Key Components

1. **Translation Script** (`scripts/translate-content.ts`)
   - Full-file translation with content change detection
   - Translation status tracking and metadata management
   - Rate limiting and error handling for API calls
   - CLI interface with multiple commands

2. **Translation Context** (`scripts/translation-context.json`)
   - Technical glossary for consistent terminology
   - Domain-specific context for AI prompts
   - Translation rules and preservation lists

3. **Content Configuration** (`content.config.ts`)
   - Schema definitions with translation metadata
   - Draft support for review workflow
   - Separate collections for each language

4. **GitHub Actions Workflow** (`.github/workflows/translate-content.yml`)
   - Automatic translation on content changes
   - Commit message keyword triggers
   - PR comments with translation summaries

## Features

### ✅ Translation Quality
- **Technical accuracy**: Specialized prompts with domain context
- **Terminology consistency**: Technical glossary with 60+ terms
- **Format preservation**: Maintains markdown structure, code blocks, URLs
- **Metadata tracking**: Translation quality, status, and timestamps

### ✅ Workflow Management
- **Draft system**: New translations marked as drafts for review
- **State tracking**: Single `translation_state` field with values: `draft`, `current`, `needs_review`, `outdated`, `approved`, `missing`
- **Change detection**: Content hashing to detect source updates

### ✅ Automation
- **CI/CD integration**: Automatic translation on content changes
- **Keyword triggers**: Force translation via commit messages
- **Rate limiting**: Respects API limits with delays
- **Error handling**: Retry logic and comprehensive error reporting

## Usage

### Local Commands

```bash
# Translate specific collections
pnpm translate articles
pnpm translate projects
pnpm translate all

# Translate single file
pnpm translate single content/articles/my-post.md

# Translate changed files (used by CI/CD)
pnpm translate changed content/articles/post1.md content/projects/project1.md

# Force retranslation (ignores current status)
pnpm translate articles --force
pnpm translate all --force

# Publish translations (remove draft flag)
pnpm translate publish articles my-post.md
pnpm translate publish projects my-project.md

# Check translation status
pnpm translate list
pnpm translate list articles
pnpm translate status
```

### Commit Message Keywords

Trigger forced translation of all content by including keywords in commit messages:

```bash
git commit -m "Update content [translate]"
git commit -m "Major changes [retranslate]"
git commit -m "New glossary [force-translate]"
git commit -m "translate:force - Updated context"
```

**Supported keywords** (case insensitive):
- `[translate]`
- `[retranslate]`
- `[force-translate]`
- `translate:force`
- `retranslate`

### Translation Workflow

1. **Create/Update English Content**
   - Write content in `content/articles/` or `content/projects/`
   - Commit changes normally

2. **Automatic Translation**
   - GitHub Actions detects changes
   - Translates new/changed files automatically
   - Creates draft translations in `content/fr/`

3. **Review Process**
   - Review translations in dev/preview mode
   - Drafts are hidden in production
   - Make corrections if needed

4. **Publish Translations**
   - Use `pnpm translate publish <collection> <filename>`
   - Removes draft flag and marks as approved
   - Translation becomes visible in production

## Configuration

### Environment Variables

```bash
# Required for translation
MISTRAL_API_KEY=your_mistral_api_key_here

# Optional metadata
TRANSLATOR_NAME="Your Name"
REVIEWER_NAME="Reviewer Name"
```

### GitHub Secrets

Add these secrets to your GitHub repository:

- `MISTRAL_API_KEY`: Your Mistral AI API key
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions

### Translation Context

Edit `scripts/translation-context.json` to:
- Add technical terms to the glossary
- Update domain context
- Modify translation rules
- Add terms to preserve as-is

## Translation Metadata

Each French translation includes metadata in frontmatter:

```yaml
---
title: "Titre traduit"
description: "Description traduite"
# ... other content fields ...

# Translation metadata
translated: true
translation_state: draft  # draft | current | needs_review | outdated | approved
original_slug: original-post-slug
source_content_hash: abc123...
translated_at: "2024-01-15T10:30:00Z"
translated_by: "AI (Mistral Codestral)"
draft: true  # Hidden in production until published
---
```

## Translation States

The `translation_state` field combines status and quality into a single, simplified field:

- 📝 **draft**: New translation, needs review (hidden in production)
- ✅ **current**: Translation is up-to-date and published
- ⚠️ **needs_review**: Source content changed, review needed
- 🔄 **outdated**: Translation significantly behind source
- 🚀 **approved**: Reviewed, approved, and published
- ❌ **missing**: No translation exists

## Best Practices

### Content Creation
1. Write clear, well-structured English content
2. Use consistent technical terminology
3. Include proper frontmatter metadata
4. Test content in dev mode before publishing

### Translation Management
1. Review all AI translations before publishing
2. Update the technical glossary regularly
3. Use force translation sparingly (API costs)
4. Monitor translation status regularly

### CI/CD Integration
1. Set up Mistral API key in GitHub secrets
2. Test workflow with small changes first
3. Monitor GitHub Actions logs for errors
4. Use commit keywords for bulk retranslation

## Troubleshooting

### Common Issues

**Translation not triggered**
- Check if files are in correct paths (`content/articles/`, `content/projects/`)
- Verify GitHub Actions workflow is enabled
- Check MISTRAL_API_KEY is set correctly

**API errors**
- Verify API key is valid and has credits
- Check rate limiting (2-second delays between calls)
- Review API response in GitHub Actions logs

**TypeScript errors**
- Run `pnpm install` to ensure dependencies are installed
- Check Node.js version (requires Node 18+)
- Verify TypeScript configuration

**Missing translations**
- Check if source files have proper frontmatter
- Verify content collections are configured correctly
- Run `pnpm translate list` to see status

### Getting Help

1. Check GitHub Actions logs for detailed error messages
2. Run translation commands locally for debugging
3. Review translation context and glossary
4. Test with single files before batch operations

## API Costs

- **Model**: Codestral (Mistral AI)
- **Rate limiting**: 2 seconds between calls
- **Typical cost**: ~$0.01-0.05 per article
- **Optimization**: Only translates changed content

## Security

- API keys stored as GitHub secrets
- No sensitive data in translation prompts
- Rate limiting prevents API abuse
- Bot detection prevents infinite loops

---

🎉 **Your AI translation system is ready!** Start by creating some English content and watch it get automatically translated to French.
