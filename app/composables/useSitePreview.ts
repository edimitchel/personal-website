import { routeContentPath } from '~~/shared/site/route-content'

export function useSitePreview() {
  const route = useRoute()
  const admin = useState('site-admin', () => false)
  const enabled = useState('site-preview', () => false)
  const markdown = useState<string | null>('site-preview-markdown', () => null)
  const loaded = useState('site-preview-loaded', () => false)

  async function refreshSession() {
    const session = await $fetch('/api/preview')
    admin.value = session.admin
    enabled.value = session.enabled
  }

  async function refreshContent() {
    const path = routeContentPath(route.path)
    if (!path) {
      markdown.value = null
      return
    }
    const result = await $fetch('/api/live-content', { query: { path } })
    markdown.value = result.markdown
  }

  async function toggle() {
    const next = !enabled.value
    const session = await $fetch('/api/preview', {
      method: 'POST',
      body: { enabled: next },
    })
    enabled.value = session.enabled
    await refreshContent()
  }

  onMounted(async () => {
    if (loaded.value) {
      return
    }
    loaded.value = true
    await refreshSession()
    await refreshContent()
  })

  watch(() => route.path, () => {
    if (admin.value) {
      void refreshContent()
    }
  })

  return { admin, enabled, markdown, toggle }
}
