import type { H3Event } from 'h3'

export function isSiteAdmin(event: H3Event) {
  if (import.meta.dev) {
    return true
  }
  return Boolean(getRequestHeader(event, 'cf-access-jwt-assertion'))
}

export function previewEnabled(event: H3Event) {
  return getCookie(event, 'site-preview') === '1'
}
