import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import { join, dirname, basename } from 'path';
import { createHash } from 'crypto';
import matter from 'gray-matter';
import { loadConfig } from 'c12';

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
  state: 'draft' | 'current' | 'needs_review' | 'outdated' | 'approved' | 'missing';
  lastTranslated?: string;
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

  const [collection, slug] = relativePath.split('/');

  return join(CONTENT_DIR, collection!, 'fr', slug!);
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
  const state = translationMeta.translation_state || 'draft';
  const lastTranslated = translationMeta.translated_at;

  // Check if source content has changed
  if (sourceHash && sourceHash !== originalFile.hash) {
    return {
      file: originalFile.relativePath,
      state: 'outdated',
      lastTranslated,
      sourceHash,
      currentHash: originalFile.hash
    };
  }

  return {
    file: originalFile.relativePath,
    state: state as TranslationStatus['state'],
    lastTranslated,
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

  return `Traduire le contenu technique suivant de l'anglais au français.

CONTEXTE:
- Domaine: ${context.domain_context.primary_domain}
- Domaines secondaires: ${context.domain_context.secondary_domains.join(', ')}
- Public cible: ${context.domain_context.target_audience}
- Ton: ${context.domain_context.tone}

GLOSSAIRE TECHNIQUE:
${glossaryEntries}

CONSERVATION TEL QUEL:
${preserveList}

REGLES DE TRADUCTION:
${context.translation_rules.map(rule => `- ${rule}`).join('\n')}

INSTRUCTIONS IMPORTANTES:
1. Conserver le frontmatter (YAML entre ---) tel qu'il est
2. Conserver les blocs de code et les codes inline tels qu'ils sont
3. Conserver les URLs, liens et identifiants techniques tels qu'ils sont
4. Maintenir le format markdown (entêtes, listes, emphases, etc.)
5. Utiliser le glossaire technique pour une terminologie cohérente
6. Conserver les termes dans la liste "CONSERVATION TEL QUEL" tels qu'ils sont
7. Traduire le contenu naturellement tout en maintenant l'exactitude technique

CONTENU A TRADUIRE:
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

  // Parse the translated content to add metadata
  const parsed = matter(translatedContent);
  const translatorName = process.env.TRANSLATOR_NAME || 'AI Translator';
  const timestamp = new Date().toISOString();

  // Add translation metadata
  const enhancedFrontmatter = {
    ...parsed.data,
    translation_state: 'draft',
    original_slug: originalFile.slug,
    source_content_hash: originalFile.hash,
    translated_by: translatorName,
    translated_at: timestamp,
    last_updated: timestamp
  };

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

  // Update metadata to mark as outdated
  const updatedFrontmatter = {
    ...parsed.data,
    translation_state: 'outdated',
    source_content_hash: originalFile.hash,
    last_updated: new Date().toISOString()
  };

  const updatedContent = matter.stringify(parsed.content, updatedFrontmatter);
  writeFileSync(frenchPath, updatedContent, 'utf-8');

  console.log(`⚠️  Translation marked as outdated: ${frenchPath}`);
}

// Publish translation (remove draft flag)
export function publishTranslation(collection: string, filename: string, contentDir?: string): void {
  const CONTENT_DIR = contentDir || join(process.cwd(), 'content');
  const frenchPath = join(CONTENT_DIR, collection, 'fr', filename);

  if (!existsSync(frenchPath)) {
    console.error(`❌ Translation not found: ${frenchPath}`);
    return;
  }

  const content = readFileSync(frenchPath, 'utf-8');
  const parsed = matter(content);

  const reviewerName = process.env.REVIEWER_NAME || 'Content Reviewer';
  const timestamp = new Date().toISOString();

  const updatedFrontmatter = {
    ...parsed.data,
    translation_state: 'approved',
    reviewed_by: reviewerName,
    reviewed_at: timestamp,
    published_at: timestamp
  };

  const updatedContent = matter.stringify(parsed.content, updatedFrontmatter);
  writeFileSync(frenchPath, updatedContent, 'utf-8');

  console.log(`🎉 Translation published: ${frenchPath}`);
}

// List translation statuses
export function listTranslationStatuses(collection?: string, contentDir?: string): TranslationStatus[] {
  const files = getContentFiles(collection, contentDir);
  const statuses: TranslationStatus[] = [];

  console.log('\n📊 Translation Status Report');
  console.log('='.repeat(80));
  console.log('File'.padEnd(40) + 'Status'.padEnd(15) + 'Last Translated');
  console.log('-'.repeat(80));

  for (const file of files) {
    const status = getTranslationStatus(file, contentDir);
    statuses.push(status);

    const statusEmoji = {
      'missing': '❌',
      'draft': '📝',
      'current': '✅',
      'needs_review': '👀',
      'outdated': '⚠️',
      'approved': '🎉'
    }[status.state];

    const lastTranslated = status.lastTranslated
      ? new Date(status.lastTranslated).toLocaleDateString()
      : 'Never';

    console.log(
      file.relativePath.padEnd(40) +
      `${statusEmoji} ${status.state}`.padEnd(15) +
      lastTranslated
    );
  }

  console.log('-'.repeat(80));

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

// Translate a single file
export async function translateFile(file: ContentFile, context: TranslationContext, force: boolean = false, contentDir?: string): Promise<void> {
  const status = getTranslationStatus(file, contentDir);

  if (status.state === 'current' && !force) {
    console.log(`✅ Translation is current: ${file.relativePath}`);
    return;
  }

  if (status.state === 'approved' && !force) {
    console.log(`🎉 Translation is approved: ${file.relativePath}`);
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
