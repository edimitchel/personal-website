import fs from 'node:fs'
import { resolve } from 'node:path'

import { defineTransformer } from '@nuxt/content'

export default defineTransformer({
    name: 'article-metadata',
    extensions: ['.md'],
    transform(file) {
        const path = file.id.replace(/^[a-z0-9_-]+\//, '');
        const fileStat = fs.statSync(resolve(__dirname, '..', 'content', path));
        const { birthtime, mtime } = fileStat;
        const lang = path.includes('/fr/') ? 'fr' : 'en';

        
        const created = file.created ?? birthtime.toISOString()
        const updated = file.updated ?? mtime.toISOString()


        const timeSection = created ? new Date(created as string).getFullYear() : ''

        return {
            ...file,
            lang,
            created,
            updated,
            timeSection
        }
    },
})