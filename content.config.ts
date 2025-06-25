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
                image: z.string(),
                created: z.date(),
                updated: z.date(),
                date: z.string(),
                author: z.string(),
                content: z.string(),
            }),
        }),

        works: defineCollection({
            source: 'works/*.yml',
            type: 'data',
            schema: z.object({
                title: z.string(),
                description: z.string(),
                slug: z.string(),
                categories: z.enum(['web', 'application', 'other']).array(),
                tags: z.enum(['php', ]).array(),
                images: z.string().array(),
                date: z.string(),
                author: z.string(),
                content: z.string(),
            }),
            
            // TODO: schema: 
        }),
    }
})