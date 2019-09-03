import { transform } from '.';

export default async (vision) => {
  const {
    title,
    type: typeId,
    excerpt,
    content,
    slug,
    tags,
  } = vision;

  const type = await transform('type', typeId);

  return {
    title,
    type,
    excerpt,
    content,
    slug,
    tags,
  }
}
