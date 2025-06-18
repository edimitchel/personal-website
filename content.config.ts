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
                date: z.string(),
                author: z.string(),
                content: z.string(),
            }),
            
            // TODO: schema: 
        }),
    }
})