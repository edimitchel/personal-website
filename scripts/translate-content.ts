#!/usr/bin/env tsx

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, basename, extname } from 'path';
import { createHash } from 'crypto';
import matter from 'gray-matter';
import { loadConfig } from 'c12';

// Load environment variables from .env file
const { config } = await loadConfig({
  name: '.env',
  cwd: process.cwd(),
  dotenv: true,
  envName: 'NODE_ENV'
}).catch(() => ({ config: {} })); // Fallback to empty object if .env doesn't exist

// Merge with process.env, giving priority to process.env
Object.assign(process.env, { ...config, ...process.env });

// Configuration
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const RATE_LIMIT_DELAY = 2000; // 2 seconds between API calls
const MAX_RETRIES = 3;

// Paths
const CONTENT_DIR = join(process.cwd(), 'content');
const TRANSLATION_CONTEXT_PATH = join(process.cwd(), 'scripts/translation-context.json');

// Types
interface TranslationContext {
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

interface ContentFile {
  path: string;
  relativePath: string;
  collection: string;
  slug: string;
  content: string;
  frontmatter: any;
  hash: string;
}

interface TranslationStatus {
  file: string;
  state: 'draft' | 'current' | 'needs_review' | 'outdated' | 'approved' | 'missing';
  lastTranslated?: string;
  sourceHash?: string;
  currentHash: string;
}

// Load translation context
function loadTranslationContext(): TranslationContext {
  try {
    const contextData = readFileSync(TRANSLATION_CONTEXT_PATH, 'utf-8');
    return JSON.parse(contextData);
  } catch (error) {
    console.error('❌ Failed to load translation context:', error);
    process.exit(1);
  }
}

// Calculate content hash
function calculateContentHash(content: string): string {
  return createHash('md5').update(content).digest('hex');
}

// Get all content files
function getContentFiles(collection?: string): ContentFile[] {
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
function getFrenchPath(originalPath: string): string {
  const relativePath = originalPath.replace(CONTENT_DIR + '/', '');
  return join(CONTENT_DIR, 'fr', relativePath);
}

// Check if translation exists and its status
function getTranslationStatus(originalFile: ContentFile): TranslationStatus {
  const frenchPath = getFrenchPath(originalFile.path);
  
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
  
  let finalState: 'draft' | 'current' | 'needs_review' | 'outdated' | 'approved' = state;
  
  if (!sourceHash || sourceHash !== originalFile.hash) {
    finalState = state === 'approved' ? 'needs_review' : 'needs_review';
  }
  
  return {
    file: originalFile.relativePath,
    state: finalState,
    lastTranslated,
    sourceHash,
    currentHash: originalFile.hash
  };
}

// Create translation prompt
function createTranslationPrompt(content: string, context: TranslationContext): string {
  const glossaryEntries = Object.entries(context.technical_glossary)
    .map(([en, fr]) => `${en} → ${fr}`)
    .join('\n');
  
  const preserveList = context.preserve_as_is.join(', ');
  
  return `Tu es un traducteur technique spécialisé dans le développement web et les technologies. Traduis le contenu markdown suivant de l'anglais vers le français.

CONTEXTE TECHNIQUE:
- Domaine: ${context.domain_context.primary_domain}
- Audience: ${context.domain_context.target_audience}
- Ton: ${context.domain_context.tone}

GLOSSAIRE TECHNIQUE:
${glossaryEntries}

ÉLÉMENTS À PRÉSERVER (ne pas traduire):
${preserveList}

RÈGLES DE TRADUCTION:
${context.translation_rules.map(rule => `- ${rule}`).join('\n')}

INSTRUCTIONS SPÉCIFIQUES:
1. Traduis UNIQUEMENT le contenu, pas les métadonnées frontmatter
2. Préserve exactement la structure markdown (titres, listes, liens, code)
3. Garde tous les extraits de code inchangés
4. Maintiens les URLs et références externes
5. Utilise le glossaire technique pour la cohérence
6. Adapte les expressions idiomatiques au français
7. Conserve le ton professionnel

CONTENU À TRADUIRE:
${content}

Réponds UNIQUEMENT avec le contenu traduit, sans explications ni commentaires.`;
}

// Call Mistral API for translation
async function translateWithMistral(content: string, context: TranslationContext): Promise<string> {
  if (!MISTRAL_API_KEY) {
    throw new Error('MISTRAL_API_KEY environment variable is required');
  }
  
  const prompt = createTranslationPrompt(content, context);
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`🤖 Calling Mistral API (attempt ${attempt}/${MAX_RETRIES})...`);
      
      const response = await fetch(MISTRAL_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MISTRAL_API_KEY}`
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
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText}\n${errorText}`);
      }
      
      const data = await response.json();
      const translatedContent = data.choices[0]?.message?.content;
      
      if (!translatedContent) {
        throw new Error('No translation content received from API');
      }
      
      console.log('✅ Translation received from Mistral API');
      return translatedContent.trim();
      
    } catch (error) {
      console.error(`❌ Translation attempt ${attempt} failed:`, error);
      
      if (attempt === MAX_RETRIES) {
        throw error;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY * attempt));
    }
  }
  
  throw new Error('All translation attempts failed');
}

// Save translated content
function saveTranslation(originalFile: ContentFile, translatedContent: string, force: boolean = false): void {
  const frenchPath = getFrenchPath(originalFile.path);
  const frenchDir = dirname(frenchPath);
  
  // Create directory if it doesn't exist
  if (!existsSync(frenchDir)) {
    require('fs').mkdirSync(frenchDir, { recursive: true });
  }
  
  // Sanitize translated content (remove null characters and other problematic chars)
  const sanitizedContent = translatedContent
    .replace(/\x00/g, '') // Remove null characters
    .replace(/\r\n/g, '\n') // Normalize line endings
    .trim();
  
  // Parse translated content to add metadata
  let parsed;
  try {
    parsed = matter(sanitizedContent);
  } catch (error) {
    console.warn(`⚠️  YAML parsing failed, treating as plain content: ${error instanceof Error ? error.message : String(error)}`);
    // If parsing fails, treat the entire content as body with empty frontmatter
    parsed = {
      data: {},
      content: sanitizedContent
    };
  }
  
  // Add translation metadata
  const translationMeta = {
    ...parsed.data,
    translated: true,
    translation_state: 'draft',
    original_slug: originalFile.slug,
    source_content_hash: originalFile.hash,
    translated_at: new Date().toISOString(),
    translated_by: process.env.TRANSLATOR_NAME || 'AI (Mistral Codestral)',
    draft: true // Mark as draft for review
  };
  
  // If force retranslation, preserve existing state if it was approved
  if (force && existsSync(frenchPath)) {
    const existingContent = readFileSync(frenchPath, 'utf-8');
    const existingMatter = matter(existingContent);
    const existingState = existingMatter.data.translation_state;
    
    if (existingState === 'approved') {
      translationMeta.translation_state = 'needs_review';
    }
  }
  
  const finalContent = matter.stringify(parsed.content, translationMeta);
  writeFileSync(frenchPath, finalContent, 'utf-8');
  
  console.log(`💾 Saved translation: ${frenchPath}`);
}

// Update translation status when source changes
function updateTranslationStatus(originalFile: ContentFile): void {
  const frenchPath = getFrenchPath(originalFile.path);
  
  if (!existsSync(frenchPath)) {
    return; // No translation exists
  }
  
  const frenchContent = readFileSync(frenchPath, 'utf-8');
  const parsed = matter(frenchContent);
  
  // Update metadata to indicate source has changed
  const updatedMeta = {
    ...parsed.data,
    translation_state: 'needs_review',
    source_content_hash: originalFile.hash,
    source_updated_at: new Date().toISOString()
  };
  
  const updatedContent = matter.stringify(parsed.content, updatedMeta);
  writeFileSync(frenchPath, updatedContent, 'utf-8');
  
  console.log(`🔄 Updated translation status: ${frenchPath}`);
}

// Translate a single file
async function translateFile(file: ContentFile, context: TranslationContext, force: boolean = false): Promise<void> {
  const status = getTranslationStatus(file);
  
  if (!force && status.state === 'current') {
    console.log(`⏭️  Skipping ${file.relativePath} (already translated and current)`);
    return;
  }
  
  if (!force && status.state === 'needs_review') {
    console.log(`⚠️  ${file.relativePath} needs review (source changed)`);
    updateTranslationStatus(file);
    return;
  }
  
  console.log(`🌐 Translating ${file.relativePath}...`);
  
  try {
    const translatedContent = await translateWithMistral(file.content, context);
    saveTranslation(file, translatedContent, force);
    
    console.log(`✅ Successfully translated ${file.relativePath}`);
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
    
  } catch (error) {
    console.error(`❌ Failed to translate ${file.relativePath}:`, error);
    throw error;
  }
}

// Publish translation (remove draft flag)
function publishTranslation(collection: string, filename: string): void {
  const frenchPath = join(CONTENT_DIR, 'fr', collection, filename);
  
  if (!existsSync(frenchPath)) {
    console.error(`❌ Translation not found: ${frenchPath}`);
    return;
  }
  
  const content = readFileSync(frenchPath, 'utf-8');
  const parsed = matter(content);
  
  const updatedMeta = {
    ...parsed.data,
    draft: false,
    translation_state: 'approved',
    published_at: new Date().toISOString(),
    published_by: process.env.REVIEWER_NAME || 'Manual review'
  };
  
  const updatedContent = matter.stringify(parsed.content, updatedMeta);
  writeFileSync(frenchPath, updatedContent, 'utf-8');
  
  console.log(`🚀 Published translation: ${frenchPath}`);
}

// List translation statuses
function listTranslationStatuses(collection?: string): void {
  const files = getContentFiles(collection);
  const statuses = files.map(file => getTranslationStatus(file));
  
  console.log('\n📊 Translation Status Report\n');
  console.log('═'.repeat(80));
  
  const statusCounts = {
    draft: 0,
    current: 0,
    needs_review: 0,
    outdated: 0,
    approved: 0,
    missing: 0
  };
  
  for (const status of statuses) {
    statusCounts[status.state]++;
    
    const stateIcon = {
      draft: '📝',
      current: '✅',
      needs_review: '⚠️ ',
      outdated: '🔄',
      approved: '🚀',
      missing: '❌'
    }[status.state];
    
    console.log(`${stateIcon} ${status.file.padEnd(40)} ${status.state.padEnd(15)} ${status.lastTranslated || 'Never'}`);
  }
  
  console.log('═'.repeat(80));
  console.log(`📈 Summary: ${statusCounts.current} current, ${statusCounts.needs_review} need review, ${statusCounts.outdated} outdated, ${statusCounts.missing} missing, ${statusCounts.draft} drafts, ${statusCounts.approved} approved`);
  console.log('');
}

// Main CLI function
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const force = args.includes('--force');
  
  if (!MISTRAL_API_KEY && !['list', 'status', 'publish'].includes(command || '')) {
    console.error('❌ MISTRAL_API_KEY environment variable is required for translation');
    process.exit(1);
  }
  
  const context = loadTranslationContext();
  
  try {
    switch (command) {
      case 'articles':
        console.log('🌐 Translating articles...');
        const articleFiles = getContentFiles('articles');
        for (const file of articleFiles) {
          await translateFile(file, context, force);
        }
        break;
        
      case 'projects':
        console.log('🌐 Translating projects...');
        const projectFiles = getContentFiles('projects');
        for (const file of projectFiles) {
          await translateFile(file, context, force);
        }
        break;
        
      case 'all':
        console.log('🌐 Translating all content...');
        const allFiles = getContentFiles();
        for (const file of allFiles) {
          await translateFile(file, context, force);
        }
        break;
        
      case 'single':
        const filePath = args[1];
        if (!filePath) {
          console.error('❌ Please specify a file path');
          process.exit(1);
        }
        
        const fullPath = filePath.startsWith('/') ? filePath : join(process.cwd(), filePath);
        if (!existsSync(fullPath)) {
          console.error(`❌ File not found: ${fullPath}`);
          process.exit(1);
        }
        
        const content = readFileSync(fullPath, 'utf-8');
        const parsed = matter(content);
        const hash = calculateContentHash(content);
        const fileCollection = fullPath.includes('/articles/') ? 'articles' : 'projects';
        const slug = basename(fullPath, '.md');
        
        const singleFile: ContentFile = {
          path: fullPath,
          relativePath: filePath,
          collection: fileCollection,
          slug,
          content,
          frontmatter: parsed.data,
          hash
        };
        
        await translateFile(singleFile, context, force);
        break;
        
      case 'changed':
        const changedFiles = args.slice(1).filter(arg => !arg.startsWith('--'));
        if (changedFiles.length === 0) {
          console.log('ℹ️  No changed files specified');
          break;
        }
        
        console.log(`🌐 Translating ${changedFiles.length} changed files...`);
        for (const filePath of changedFiles) {
          const fullPath = join(process.cwd(), filePath);
          if (existsSync(fullPath) && filePath.endsWith('.md')) {
            const content = readFileSync(fullPath, 'utf-8');
            const parsed = matter(content);
            const hash = calculateContentHash(content);
            const fileCollection = filePath.includes('/articles/') ? 'articles' : 'projects';
            const slug = basename(filePath, '.md');
            
            const file: ContentFile = {
              path: fullPath,
              relativePath: filePath,
              collection: fileCollection, // Renamed from changedFileCollection to fileCollection
              slug,
              content,
              frontmatter: parsed.data,
              hash
            };
            
            await translateFile(file, context, force);
          }
        }
        break;
        
      case 'publish':
        const publishCollection = args[1];
        const publishFilename = args[2];
        
        if (!publishCollection || !publishFilename) {
          console.error('❌ Usage: npm run translate publish <collection> <filename>');
          process.exit(1);
        }
        
        publishTranslation(publishCollection, publishFilename);
        break;
        
      case 'list':
      case 'status':
        const statusCollection = args[1];
        listTranslationStatuses(statusCollection);
        break;
        
      default:
        console.log(`
🌐 AI Content Translation Tool

Usage:
  npm run translate <command> [options]

Commands:
  articles              Translate all articles
  projects              Translate all projects  
  all                   Translate all content
  single <file>         Translate a single file
  changed <files...>    Translate specific changed files
  publish <collection> <filename>  Publish a translation (remove draft flag)
  list [collection]     List translation statuses
  status [collection]   Same as list

Options:
  --force              Force retranslation even if current

Examples:
  npm run translate articles
  npm run translate single content/articles/my-post.md
  npm run translate changed content/articles/post1.md content/projects/project1.md --force
  npm run translate publish articles my-post.md
  npm run translate list articles

Environment Variables:
  MISTRAL_API_KEY      Required for translation (Mistral AI API key)
  TRANSLATOR_NAME      Optional translator name for metadata
  REVIEWER_NAME        Optional reviewer name for publishing
        `);
        break;
    }
    
    console.log('🎉 Translation process completed!');
    
  } catch (error) {
    console.error('❌ Translation process failed:', error);
    process.exit(1);
  }
}

// Run the CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
