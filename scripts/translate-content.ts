#!/usr/bin/env tsx

import {
  loadTranslationContext,
  getContentFiles,
  translateFile,
  publishTranslation,
  listTranslationStatuses,
  calculateContentHash,
  updateAllHashes,
  type ContentFile,
} from './translate-content-lib.js';
import { loadConfig } from 'c12';
import { readFileSync, existsSync } from 'node:fs';
import { join, basename } from 'path';
import matter from 'gray-matter';

// Load environment variables from .env file
const { config } = await loadConfig({
  name: '.env',
  cwd: process.cwd(),
  dotenv: true,
  envName: 'NODE_ENV'
}).catch(() => ({ config: {} })); // Fallback to empty object if .env doesn't exist

// Merge with process.env, giving priority to process.env
Object.assign(process.env, { ...config, ...process.env });

// Main CLI function
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const force = args.includes('--force');
  
  if (!process.env.MISTRAL_API_KEY && !['list', 'status', 'publish', 'update-hashes'].includes(command || '')) {
    console.error('❌ MISTRAL_API_KEY environment variable is required for translation');
    process.exit(1);
  }
  
  try {
    const context = loadTranslationContext();
    
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
        
        // Filter out French files and files that aren't in content/articles or content/projects
        const sourceFiles = changedFiles.filter(filePath => {
          // Skip French files
          if (filePath.includes('/fr/')) {
            return false;
          }
          
          // Only include markdown files from articles or projects
          return filePath.endsWith('.md') && 
                (filePath.includes('/articles/') || 
                 filePath.includes('/projects/') ||
                 filePath.includes('/pages/'));
        });
        
        if (sourceFiles.length === 0) {
          console.log('ℹ️  No valid source files to translate');
          break;
        }
        
        console.log(`🌐 Translating ${sourceFiles.length} changed files...`);
        for (const filePath of sourceFiles) {
          const fullPath = join(process.cwd(), filePath);
          if (existsSync(fullPath)) {
            const content = readFileSync(fullPath, 'utf-8');
            const parsed = matter(content);
            const hash = calculateContentHash(content);
            
            // Determine collection based on path
            let fileCollection = 'articles';
            if (filePath.includes('/projects/')) {
              fileCollection = 'projects';
            } else if (filePath.includes('/pages/')) {
              fileCollection = 'pages';
            }
            
            const slug = basename(filePath, '.md');
            
            const file: ContentFile = {
              path: fullPath,
              relativePath: filePath,
              collection: fileCollection,
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
          console.error('❌ Usage: pnpm translate publish <collection> <filename>');
          process.exit(1);
        }
        
        publishTranslation(publishCollection, publishFilename);
        break;
        
      case 'list':
      case 'status':
        const statusCollection = args[1];
        listTranslationStatuses(statusCollection);
        break;
        
      case 'update-hashes':
        const hashCollection = args[1];
        updateAllHashes(hashCollection);
        break;
        
      default:
        console.log(`
🌐 AI Content Translation Tool

Usage:
  pnpm translate <command> [options]

Commands:
  articles              Translate all articles
  projects              Translate all projects  
  all                   Translate all content
  single <file>         Translate a single file
  changed <files...>    Translate specific changed files
  publish <collection> <filename>  Publish a translation (remove draft flag)
  list [collection]     List translation statuses
  status [collection]   Same as list
  update-hashes [collection]  Update file hashes to avoid outdated mismatches (excludes arte)

Options:
  --force              Force retranslation even if current

Examples:
  pnpm translate articles
  pnpm translate single content/articles/my-post.md
  pnpm translate changed content/articles/post1.md content/projects/project1.md --force
  pnpm translate publish articles my-post.md
  pnpm translate list articles
  pnpm translate update-hashes
  pnpm translate update-hashes projects

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
