import { defineCollection, z } from 'astro:content';

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    metaDescription: z.string().max(160),
    ogImage: z.string().optional(),
    publishDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { pages };
