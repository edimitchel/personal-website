import { transform } from '@/server/transformers';

export default async (story) => {
  const {
    slug,
    published_at,
    lang,
    name,
  } = story

  // Remove useless
  const {
    title,
    visions,
  } = story.content
  
  const mappedVisions = await transform('vision', visions)
  
  return {
    title,
    lang,
    visions: mappedVisions,
    date: published_at,
    slug
  }
}
