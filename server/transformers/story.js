import { transform } from '@/server/transformers';

export default async (story) => {
  const {
    slug,
    published_at,
    lang,
    name,
    content
  } = story

  // Remove useless
  const {
    title,
    visions,
  } = content
    
  return {
    title,
    lang,
    visions: await transform('vision', visions),
    date: published_at,
    slug
  }
}
