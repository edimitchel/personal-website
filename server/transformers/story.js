import { transform } from '@/server/transformers';

export default async (story) => {
  const {
    slug,
    published_at,
    lang,
    content
  } = story

  const {
    title,
    titleExcerpt,
    visions,
  } = content
    
  return {
    title,
    titleExcerpt,
    lang,
    visions: await transform('vision', visions),
    date: published_at,
    slug
  }
}
