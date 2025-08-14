import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import { join, dirname, basename } from 'path';
import { createHash } from 'crypto';
import matter from 'gray-matter';

// Configuration
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';
const RATE_LIMIT_DELAY = 2000; // 2 seconds between API calls
const MAX_RETRIES = 3;

// Types
export interface TranslationContext {
  technical_glossary: Record<string, string>;
  preserve_as_is: string[];
  domain_context: {
    primary_domain: string;
    secondary_domains: string[];
    target_audience: string;
    tone: string;
  };
  translation_rules: string[];
}

export interface ContentFile {
  path: string;
  relativePath: string;
  collection: string;
  slug: string;
  content: string;
  frontmatter: any;
  hash: string;
}

export interface TranslationStatus {
  file: string;
  state: 'current' | 'outdated' | 'missing';
  sourceHash?: string;
  currentHash: string;
}

// Load translation context
export function loadTranslationContext(contextPath?: string): TranslationContext {
  const TRANSLATION_CONTEXT_PATH = contextPath || join(process.cwd(), 'scripts/translation-context.json');

  try {
    const contextData = readFileSync(TRANSLATION_CONTEXT_PATH, 'utf-8');
    return JSON.parse(contextData);
  } catch (error) {
    console.error('❌ Failed to load translation context:', error);
    process.exit(1);
  }
}

// Calculate content hash
export function calculateContentHash(content: string): string {
  return createHash('md5').update(content).digest('hex');
}

// Get all content files
export function getContentFiles(collection?: string, contentDir?: string): ContentFile[] {
  const CONTENT_DIR = contentDir || join(process.cwd(), 'content');
  const files: ContentFile[] = [];
  const collections = collection ? [collection] : ['articles', 'projects'];

  for (const coll of collections) {
    const collectionPath = join(CONTENT_DIR, coll);
    if (!existsSync(collectionPath)) {
      console.warn(`⚠️  Collection directory not found: ${collectionPath}`);
      continue;
    }

    const entries = readdirSync(collectionPath);
    for (const entry of entries) {
      const entryPath = join(collectionPath, entry);
      const stat = statSync(entryPath);

      if (stat.isFile() && entry.endsWith('.md')) {
        const content = readFileSync(entryPath, 'utf-8');
        const parsed = matter(content);
        const hash = calculateContentHash(content);

        files.push({
          path: entryPath,
          relativePath: `content/${coll}/${entry}`,
          collection: coll,
          slug: basename(entry, '.md'),
          content,
          frontmatter: parsed.data,
          hash
        });
      }
    }
  }

  return files;
}

// Get French translation path
export function getFrenchPath(originalPath: string, contentDir?: string): string {
  const CONTENT_DIR = contentDir || join(process.cwd(), 'content');

  // Extract the relative path from the original path
  let relativePath = originalPath;
  if (originalPath.includes('/content/')) {
    // Extract everything after '/content/'
    relativePath = originalPath.substring(originalPath.indexOf('/content/') + '/content/'.length);
  } else if (originalPath.startsWith(CONTENT_DIR)) {
    // Remove the content directory prefix
    relativePath = originalPath.replace(CONTENT_DIR + '/', '');
  }

  // Split the path into segments
  const segments = relativePath.split('/');
  const collection = segments[0] || ''; // First segment is always the collection
  
  // For articles and projects, the second segment is the slug
  // For pages or other content types, we need to preserve the directory structure
  if (collection === 'articles' || collection === 'projects') {
    const slug = segments[1] || '';
    return join(CONTENT_DIR, collection, 'fr', slug);
  } else {
    // For other content types like pages, preserve the path structure
    // but insert 'fr' after the collection
    const restOfPath = segments.slice(1).join('/');
    return join(CONTENT_DIR, collection, 'fr', restOfPath);
  }
}

// Check if translation exists and its status
export function getTranslationStatus(originalFile: ContentFile, contentDir?: string): TranslationStatus {
  const frenchPath = getFrenchPath(originalFile.path, contentDir);

  if (!existsSync(frenchPath)) {
    return {
      file: originalFile.relativePath,
      state: 'missing',
      currentHash: originalFile.hash
    };
  }

  const frenchContent = readFileSync(frenchPath, 'utf-8');
  const frenchMatter = matter(frenchContent);
  const translationMeta = frenchMatter.data;

  const sourceHash = translationMeta.source_content_hash;

  // Check if source content has changed
  if (sourceHash && sourceHash !== originalFile.hash) {
    return {
      file: originalFile.relativePath,
      state: 'outdated',
      sourceHash,
      currentHash: originalFile.hash
    };
  }

  return {
    file: originalFile.relativePath,
    state: 'current',
    sourceHash,
    currentHash: originalFile.hash
  };
}

// Create translation prompt
export function createTranslationPrompt(content: string, context: TranslationContext): string {
  const glossaryEntries = Object.entries(context.technical_glossary)
    .map(([en, fr]) => `- ${en} → ${fr}`)
    .join('\n');

  const preserveList = context.preserve_as_is.join(', ');

  return `You are a professional technical translator. Translate the following content from English to French. Return ONLY the translated content without any meta-commentary, explanations, or introductory text.

CONTEXT:
- Domain: ${context.domain_context.primary_domain}
- Secondary domains: ${context.domain_context.secondary_domains.join(', ')}
- Target audience: ${context.domain_context.target_audience}
- Tone: ${context.domain_context.tone}

TECHNICAL GLOSSARY:
${glossaryEntries}

PRESERVE AS-IS:
${preserveList}

TRANSLATION RULES:
${context.translation_rules.map(rule => `- ${rule}`).join('\n')}

CRITICAL INSTRUCTIONS:
1. Return ONLY the translated content - no explanations or meta-commentary
2. Preserve frontmatter (YAML between ---) exactly as-is
3. Preserve code blocks and inline code exactly as-is
4. Preserve URLs, links, and technical identifiers exactly as-is
5. Maintain markdown formatting (headers, lists, emphasis, etc.)
6. Use the technical glossary for consistent terminology
7. Keep terms in "PRESERVE AS-IS" list unchanged
8. Translate content naturally while maintaining technical accuracy

CONTENT TO TRANSLATE:
${content}
`;
}

// Call Mistral API for translation
export async function translateWithMistral(content: string, context: TranslationContext, apiKey?: string): Promise<string> {
  const MISTRAL_API_KEY = apiKey || process.env.MISTRAL_API_KEY;

  if (!MISTRAL_API_KEY) {
    throw new Error('MISTRAL_API_KEY environment variable is required');
  }

  const prompt = createTranslationPrompt(content, context);

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(MISTRAL_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MISTRAL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'codestral-latest',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.1,
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        if (response.status === 429 && attempt < MAX_RETRIES) {
          console.log(`⏳ Rate limited, waiting ${RATE_LIMIT_DELAY * attempt}ms before retry ${attempt + 1}...`);
          await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY * attempt));
          continue;
        }
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const translatedContent = data.choices[0].message.content;

      // Add delay between successful requests to respect rate limits
      if (attempt === 1) {
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
      }

      return translatedContent;

    } catch (error) {
      console.error(`❌ Translation attempt ${attempt} failed:`, error);

      if (attempt === MAX_RETRIES) {
        throw new Error(`Translation failed after ${MAX_RETRIES} retries: ${error}`);
      }

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY * attempt));
    }
  }

  throw new Error(`Translation failed after ${MAX_RETRIES} retries`);
}

// Save translated content
export function saveTranslation(originalFile: ContentFile, translatedContent: string, force: boolean = false, contentDir?: string): void {
  const CONTENT_DIR = contentDir || join(process.cwd(), 'content');
  const frenchPath = getFrenchPath(originalFile.path, contentDir);

  // Check if translation already exists
  if (existsSync(frenchPath) && !force) {
    console.log(`ℹ️  Translation already exists: ${frenchPath} (use --force to overwrite)`);
    return;
  }

  // Ensure directory exists
  const frenchDir = dirname(frenchPath);
  if (!existsSync(frenchDir)) {
    mkdirSync(frenchDir, { recursive: true });
  }

  // Parse the translated content to add minimal metadata
  const parsed = matter(translatedContent);

  // Add only essential translation metadata
  const enhancedFrontmatter = {
    ...parsed.data,
    original_slug: originalFile.slug,
    source_content_hash: originalFile.hash
  };

  // Remove unwanted metadata fields if they exist
  delete enhancedFrontmatter.translation_state;
  delete enhancedFrontmatter.translated_by;
  delete enhancedFrontmatter.translated_at;
  delete enhancedFrontmatter.last_updated;
  delete enhancedFrontmatter.reviewed_by;
  delete enhancedFrontmatter.reviewed_at;
  delete enhancedFrontmatter.published_at;

  // Reconstruct the content with enhanced frontmatter
  const finalContent = matter.stringify(parsed.content, enhancedFrontmatter);

  // Save the file
  writeFileSync(frenchPath, finalContent, 'utf-8');
  console.log(`✅ Translation saved: ${frenchPath}`);
}

// Update translation status when source changes
export function updateTranslationStatus(originalFile: ContentFile, contentDir?: string): void {
  const frenchPath = getFrenchPath(originalFile.path, contentDir);

  if (!existsSync(frenchPath)) {
    return; // No translation exists
  }

  const frenchContent = readFileSync(frenchPath, 'utf-8');
  const parsed = matter(frenchContent);

  // Check if source hash has changed
  const currentSourceHash = parsed.data.source_content_hash;
  if (currentSourceHash === originalFile.hash) {
    return; // No change needed
  }

  // Update metadata with new source hash
  const updatedFrontmatter = {
    ...parsed.data,
    source_content_hash: originalFile.hash
  };

  const updatedContent = matter.stringify(parsed.content, updatedFrontmatter);
  writeFileSync(frenchPath, updatedContent, 'utf-8');

  console.log(`⚠️  Translation source hash updated: ${frenchPath}`);
}

// Publish translation (no-op since we removed state management)
export function publishTranslation(collection: string, filename: string, contentDir?: string): void {
  const CONTENT_DIR = contentDir || join(process.cwd(), 'content');
  const frenchPath = join(CONTENT_DIR, collection, 'fr', filename);

  if (!existsSync(frenchPath)) {
    console.error(`❌ Translation not found: ${frenchPath}`);
    return;
  }

  console.log(`✅ Translation exists: ${frenchPath}`);
}

// List translation statuses
export function listTranslationStatuses(collection?: string, contentDir?: string): TranslationStatus[] {
  const files = getContentFiles(collection, contentDir);
  const statuses: TranslationStatus[] = [];

  console.log('\n📊 Translation Status Report');
  console.log('='.repeat(90));
  console.log('File'.padEnd(60) + 'Status'.padEnd(15) + 'Translated');
  console.log('-'.repeat(90));

  for (const file of files) {
    const status = getTranslationStatus(file, contentDir);
    statuses.push(status);

    const statusEmoji = {
      'missing': '❌',
      'current': '✅',
      'outdated': '⚠️'
    }[status.state];

    console.log(
      file.relativePath.padEnd(60) +
      `${statusEmoji} ${status.state}`.padEnd(15) +
      (status.sourceHash ? 'Translated' : 'Never')
    );
  }

  console.log('-'.repeat(90));

  const summary = statuses.reduce((acc, status) => {
    acc[status.state] = (acc[status.state] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('\n📈 Summary:');
  Object.entries(summary).forEach(([state, count]) => {
    console.log(`  ${state}: ${count}`);
  });

  return statuses;
}

// Update hashes for all files to avoid outdated mismatches
export function updateAllHashes(collection?: string, contentDir?: string): void {
  const files = getContentFiles(collection, contentDir);
  let updatedCount = 0;

  console.log('\n🔄 Updating file hashes...');
  console.log('='.repeat(60));

  for (const file of files) {
    const frenchPath = getFrenchPath(file.path, contentDir);
    
    if (!existsSync(frenchPath)) {
      console.log(`ℹ️  No translation exists: ${file.relativePath}`);
      continue;
    }

    const frenchContent = readFileSync(frenchPath, 'utf-8');
    const parsed = matter(frenchContent);
    const currentSourceHash = parsed.data.source_content_hash;

    // Update hash if it's different
    if (currentSourceHash !== file.hash) {
      const updatedFrontmatter = {
        ...parsed.data,
        source_content_hash: file.hash
      };

      const updatedContent = matter.stringify(parsed.content, updatedFrontmatter);
      writeFileSync(frenchPath, updatedContent, 'utf-8');
      
      console.log(`✅ Hash updated: ${file.relativePath}`);
      console.log(`   Old: ${currentSourceHash || 'none'}`);
      console.log(`   New: ${file.hash}`);
      updatedCount++;
    } else {
      console.log(`✓  Hash current: ${file.relativePath}`);
    }
  }

  console.log('='.repeat(60));
  console.log(`📊 Updated ${updatedCount} file hashes`);
}

// Translate a single file
export async function translateFile(file: ContentFile, context: TranslationContext, force: boolean = false, contentDir?: string): Promise<void> {
  const status = getTranslationStatus(file, contentDir);

  if (status.state === 'current' && !force) {
    console.log(`✅ Translation is current: ${file.relativePath}`);
    return;
  }

  console.log(`🌐 Translating: ${file.relativePath}`);

  try {
    const translatedContent = await translateWithMistral(file.content, context);
    saveTranslation(file, translatedContent, force, contentDir);
  } catch (error) {
    console.error(`❌ Failed to translate ${file.relativePath}:`, error);
    throw error;
  }
}
