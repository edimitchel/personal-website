import { transform } from '@/server/transformers';

export default async (story) => {
  const {
    slug,
    published_at,
    created_at,
    lang,
    content,
  } = story

  const {
    title,
    titleExcerpt,
    description,
    visions,
    thumbnail,
    cover,
  } = content

  let date = published_at;

  if (process.env.NODE_ENV === 'development') {
    date = created_at;
  }

  return {
    title,
    titleExcerpt,
    description,
    thumbnail,
    cover,
    lang,
    visions: await transform('vision', visions),
    date: new Date(date),
    slug,
  }
}
