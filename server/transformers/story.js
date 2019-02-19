export default (story) => { 
  const {
    slug,
    published_at
  } = story

  // Remove useless
  const {
    component,
    ...content
  } = story.content

  return {
    ...content,
    date: published_at,
    slug
  }
}
