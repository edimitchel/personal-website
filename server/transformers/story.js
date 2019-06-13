import { transform } from '.';

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

  let date = new Date(published_at || created_at);

  return {
    title,
    titleExcerpt,
    description,
    date,
    thumbnail,
    cover,
    lang,
    visions: await transform('vision', visions),
    slug,
  }
}
