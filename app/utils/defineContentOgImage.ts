type ContentOgImage = {
  url?: string
  component?: string
  props?: Record<string, unknown>
}

type PageOgProps = {
  title?: string
  description?: string
  headline?: string
  image?: string
}

export function defineContentOgImage(og?: ContentOgImage) {
  if (!og)
    return

  defineOgImage(
    (og.component || 'Page') as 'Page',
    (og.props ?? {}) as PageOgProps,
    og.url ? { url: og.url } : undefined,
  )
}
