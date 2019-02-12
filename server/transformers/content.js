export default (contents) => {
  contents.content_id = contents.id

  delete contents.id;

  return Promise.resolve(contents);
}
