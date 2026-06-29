import type { ContentNavigationItem, PagesCollectionItem, ProjectsCollectionItem } from '@nuxt/content'

function getProjectName(projectContent: PagesCollectionItem | ContentNavigationItem) {
  return projectContent.stem?.split('/').at(-1)
}

export function transformProject(
  project: (PagesCollectionItem | ProjectsCollectionItem) | ContentNavigationItem,
) {
  return { ...project, slug: getProjectName(project) }
}