import fs from 'node:fs'
import { resolve } from 'node:path'
import { execSync } from 'node:child_process'

import { defineTransformer } from '@nuxt/content'

export default defineTransformer({
    name: 'article-metadata',
    extensions: ['.md'],
    transform(file) {
        const path = file.id.replace(/^[a-z0-9_-]+\//, '');
        const filePath = resolve(__dirname, '..', 'content', path);
        const fileStat = fs.statSync(filePath);
        const { birthtime } = fileStat;
        const lang = path.includes('/fr/') ? 'fr' : 'en';

        // Get git last commit date for this file
        const getGitLastModified = (filePath: string): string => {
            try {
                const gitDate = execSync(`git log -1 --format="%ai" -- "${filePath}"`, { 
                    encoding: 'utf8',
                    cwd: resolve(__dirname, '..')
                }).trim();
                return gitDate ? new Date(gitDate).toISOString() : birthtime.toISOString();
            } catch {
                return birthtime.toISOString();
            }
        };
        
        const created = file.created ?? birthtime.toISOString()
        const updated = file.updated ?? getGitLastModified(filePath)


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