import { defineCollection, defineContentConfig, z } from "@nuxt/content";

// Base content schema for reusability
const baseContentSchema = z.object({
  title: z.string(),
  lang: z.enum(['en', 'fr']).optional().default('en'),
  description: z.string(),
  slug: z.string(),
  draft: z.boolean().optional().default(false),
});

// Translation metadata schema
const translationMetaSchema = z.object({
  translated: z.boolean().optional(),
  translation_state: z.enum(['draft', 'current', 'needs_review', 'outdated', 'approved']).optional(),
  original_slug: z.string().optional(),
  source_content_hash: z.string().optional(),
  translated_at: z.string().optional(),
  translated_by: z.string().optional(),
  published_at: z.string().optional(),
  published_by: z.string().optional(),
  source_updated_at: z.string().optional(),
});

// Article schema
const articleSchema = baseContentSchema.extend({
  categories: z.string().array(),
  tags: z.string().array(),
  image: z.string().editor({ input: 'media' }),
  created: z.date(),
  updated: z.date(),
  date: z.string(),
  author: z.string(),
  content: z.string(),
}).merge(translationMetaSchema);

// Project schema
const projectSchema = baseContentSchema.extend({
  excerpt: z.object({
    type: z.string(),
    children: z.any(),
  }),
  icons: z.string().array(),
  creation: z.date(),
  organization: z.string().optional(),
  duration: z.number().optional(),
  type: z.enum(['application', 'website', 'consulting', 'experience']),
  status: z.enum(['published', 'draft', 'stand by']),
  categories: z.enum(['web', 'application', 'other']).array(),
  technologies: z.string().array(),
  image: z.string().editor({ input: 'media' }),
  date: z.string(),
  authors: z.string().array(),
});

export default defineContentConfig({
  collections: {
    content: defineCollection({
      source: 'pages/**/*.md',
      type: 'page',
      schema: baseContentSchema,
    }),

    // English collections
    articles: defineCollection({
      source: 'articles/**/*.md',
      type: 'page',
      schema: articleSchema,
    }),

    projects: defineCollection({
      source: 'projects/**/*.md',
      type: 'page',
      schema: projectSchema,
    }),
  }
})