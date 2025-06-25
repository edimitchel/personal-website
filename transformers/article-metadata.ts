import fs from 'node:fs'
import { resolve } from 'node:path'

import { defineTransformer } from '@nuxt/content'

export default defineTransformer({
    name: 'article-metadata',
    extensions: ['.md'],
    transform(file) {
        if (file.id.includes('articles')) {
            const fileStat = fs.statSync(resolve(__dirname, '..', 'content', file.id.replace('articles/', '') as string));
            const { birthtime, mtime } = fileStat;
            return {
                ...file,
                created: birthtime.toISOString(),
                updated: mtime.toISOString(),
            }
        }

        return file;
    },
})