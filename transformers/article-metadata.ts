import fs from 'node:fs'
import { resolve } from 'node:path'

import { defineTransformer } from '@nuxt/content'

export default defineTransformer({
    name: 'article-metadata',
    extensions: ['.md'],
    transform(file) {
        if (file.id.includes('articles')) {
            const path = file.id.replace(/^[a-z0-9_-]+\//, '');
            console.log(file.id, path)
            const fileStat = fs.statSync(resolve(__dirname, '..', 'content', path));
            const { birthtime, mtime } = fileStat;
            return {
                ...file,
                created: file.created ?? birthtime.toISOString(),
                updated: file.updated ?? mtime.toISOString(),
            }
        }

        return file;
    },
})