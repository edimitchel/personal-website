import fs from 'fs';
import path from 'path';

// Function to convert HTML to markdown (basic conversion)
function htmlToMarkdown(html) {
  return html
    // Remove HTML comments and scripts
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    
    // Convert headings
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1')
    .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1')
    .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1')
    
    // Convert paragraphs
    .replace(/<p[^>]*>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    
    // Convert line breaks
    .replace(/<br\s*\/?>/gi, '\n')
    
    // Convert links
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    
    // Convert images
    .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)')
    .replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, '![]($1)')
    
    // Convert emphasis
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    
    // Convert blockquotes
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, (match, content) => {
      return content.split('\n').map(line => `> ${line.trim()}`).join('\n');
    })
    
    // Convert lists
    .replace(/<ul[^>]*>(.*?)<\/ul>/gi, '$1')
    .replace(/<ol[^>]*>(.*?)<\/ol>/gi, '$1')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
    
    // Convert code blocks
    .replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gi, '```\n$1\n```')
    .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
    
    // Remove remaining HTML tags
    .replace(/<[^>]*>/g, '')
    
    // Decode HTML entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8230;/g, '...')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&hellip;/g, '...')
    
    // Clean up extra whitespace
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .replace(/^\s+|\s+$/g, '')
    .trim();
}

// Function to create a safe filename from title
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[ñ]/g, 'n')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Function to format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

async function generateBlogArticles() {
  try {
    console.log('Fetching blog articles from API...');
    
    // Fetch data from API
    const response = await fetch('https://book.micheledighoffer.fr/system/public/post/getAll');
    const data = await response.json();
    
    if (!data.status || !data.data) {
      throw new Error('Invalid API response');
    }
    
    const articles = data.data;
    console.log(`Found ${articles.length} articles`);
    
    // Create articles directory if it doesn't exist
    const articlesDir = '/Users/micheledighofffer/DEV/personal-website/content/articles';
    if (!fs.existsSync(articlesDir)) {
      fs.mkdirSync(articlesDir, { recursive: true });
    }
    
    // Process each article
    for (const article of articles) {
      const slug = article.slug || createSlug(article.title);
      const filename = `${slug}.md`;
      const filepath = path.join(articlesDir, filename);
      
      // Convert HTML content to markdown
      const markdownContent = htmlToMarkdown(article.content);
      const markdownExcerpt = htmlToMarkdown(article.excerpt);
      
      // Create frontmatter
      const frontmatter = `---
title: "${article.title.replace(/"/g, '\\"')}"
description: "${markdownExcerpt.replace(/"/g, '\\"').replace(/\n/g, ' ').substring(0, 160)}..."
created: ${formatDate(article.date)}
updated: ${formatDate(article.date)}
slug: ${slug}
categories: ${JSON.stringify(article.cats || [])}
thumbnail: ${article.thumbnail ? `"${article.thumbnail.src}"` : 'null'}
originalUrl: "${article.url}"
---

`;
      
      // Combine frontmatter and content
      const fullContent = frontmatter + markdownContent;
      
      // Write file
      fs.writeFileSync(filepath, fullContent, 'utf8');
      console.log(`Created: ${filename}`);
    }
    
    console.log(`\nSuccessfully generated ${articles.length} blog article markdown files!`);
    console.log(`Files created in: ${articlesDir}`);
    
  } catch (error) {
    console.error('Error generating blog articles:', error);
    process.exit(1);
  }
}

// Run the script
generateBlogArticles();
