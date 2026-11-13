import type { H3Event } from 'h3'

export async function isSiteAdmin(event: H3Event) {
  const session = await getUserSession(event)
  return Boolean(session?.user)
}

export function previewEnabled(event: H3Event) {
  return getCookie(event, 'site-preview') === '1'
}
