import fs from 'node:fs'
import { resolve } from 'node:path'

import { defineTransformer } from '@nuxt/content'

export default defineTransformer({
    name: 'article-metadata',
    extensions: ['.md'],
    transform(file) {
        if (file.id.includes('articles') || file.id.includes('projects')) {
            const path = file.id.replace(/^[a-z0-9_-]+\//, '');
            const fileStat = fs.statSync(resolve(__dirname, '..', 'content', path));
            const { birthtime, mtime } = fileStat;
            const lang = path.includes('/fr/') ? 'fr' : 'en';
            return {
                ...file,
                lang,
                created: file.created ?? birthtime.toISOString(),
                updated: file.updated ?? mtime.toISOString(),
            }
        }

        return file;
    },
})