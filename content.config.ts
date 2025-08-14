import { defineCollection, defineContentConfig, z } from "@nuxt/content";
import { asOgImageCollection } from "nuxt-og-image/content";

// Base content schema for reusability
const baseContentSchema = z.object({
  title: z.string(),
  lang: z.enum(['en', 'fr']).optional().default('en'),
  description: z.string(),
  created: z.date(),
  updated: z.date(),
  slug: z.string(),
  draft: z.boolean().optional().default(false),
});

// Translation metadata schema
const translationMetaSchema = z.object({
  original_slug: z.string().optional(),
  source_content_hash: z.string().optional(),
});

// Article schema
const articleSchema = baseContentSchema.extend({
  categories: z.string().array(),
  tags: z.string().array(),
  author: z.string(),
  thumbnail: z.string().optional(),
  thumbnail_nudge: z.object({
    x: z.number().optional(),
    y: z.number().optional()
  }).optional(),
}).merge(translationMetaSchema);

// Project schema
const projectSchema = baseContentSchema.extend({
  excerpt: z.object({
    type: z.string(),
    children: z.any(),
  }),
  startedAt: z.date().optional(),
  completedAt: z.date().optional(),
  organization: z.string().optional(),
  duration: z.number().optional(),
  type: z.enum(['application', 'website', 'consulting', 'experience']),
  url: z.string().optional(),
  status: z.enum(['published', 'draft', 'stand by']),
  categories: z.enum(['web', 'application', 'other']).array(),
  technologies: z.string().array(),
  relatedArticleSlug: z.string().optional(),
  image: z.string().editor({ input: 'media' }),
  date: z.string(),
  authors: z.string().array(),
});

export default defineContentConfig({
  collections: {
    pages: defineCollection(
      asOgImageCollection({
        source: 'pages/**/*.md',
        type: 'page',
        schema: baseContentSchema,
      })),

    // English collections
    articles: defineCollection(
      asOgImageCollection({
        source: 'articles/**/*.md',
        type: 'page',
        schema: articleSchema,
      })),

    projects: defineCollection(
      asOgImageCollection({
        source: 'projects/**/*.md',
        type: 'page',
        schema: projectSchema,
      })),
  }
})