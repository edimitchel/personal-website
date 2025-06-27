import { defineCollection, defineContentConfig, z } from "@nuxt/content";

export default defineContentConfig({
    collections: {
        content: defineCollection({
            source: '*.md',
            type: 'page',
        }),
        articles: defineCollection({
            source: 'articles/*.md',
            type: 'page',
            schema: z.object({
                title: z.string(),
                description: z.string(),
                slug: z.string(),
                categories: z.string().array(),
                tags: z.string().array(),
                image: z.string().editor({ input: 'media' }),
                created: z.date(),
                updated: z.date(),
                date: z.string(),
                author: z.string(),
                content: z.string(),
            }),
        }),

        projects: defineCollection({
            source: 'projects/*.md',
            type: 'page',
            schema: z.object({
                title: z.string(),
                description: z.string(),
                excerpt: z.object({
                    type: z.string(),
                    children: z.any(),
                }),
                slug: z.string(),
                creation: z.date(),
                type: z.enum(['application', 'website', 'consulting']),
                status: z.enum(['published', 'draft', 'stand by']),
                categories: z.enum(['web', 'application', 'other']).array(),
                technologies: z.string().array(),
                image: z.string().editor({ input: 'media' }),
                date: z.string(),
                authors: z.string().array(),
            }),
        }),
    }
})