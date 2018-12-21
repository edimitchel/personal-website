const path = require('path');
const turndown = require('turndown');
const fs = require('fs-extra');

const turndownService = new turndown();

let [node, workingFile, entryFile] = process.argv;

const dir = path.dirname(workingFile);
const jsonFile = path.resolve(entryFile);

const jsonContent = fs.readJSONSync(jsonFile);

const posts = [];

jsonContent.forEach(post => {

    const { content, title, slug, excerpt, cats, date, thumbnail } = post;

    posts.push({
        title,
        slug,
        content: turndownService.turndown(content),
        categories: cats,
        date,
        thumbnail,
        excerpt: turndownService.turndown(excerpt),
    });

});

const exportDir = path.resolve('export');
fs.emptyDirSync(exportDir);
posts.forEach(post => {
    fs.mkdirSync(path.join(exportDir, post.slug));
    fs.writeFileSync(path.join(exportDir, post.slug, 'README.md'), renderContent(post), 'utf8');
});


function renderContent(post) {
    return `---
title: "${post.title}"
description: "${post.excerpt}"
layout: ArticleLayout
image: ${post.thumbnail.src}
date: ${post.date}
category: ${[...post.categories].map(c => "\n    - " + c).join('')}
---

${post.content}
`;
};