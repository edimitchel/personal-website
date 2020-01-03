export const actions = {
  async nuxtServerInit(
    { dispatch },
    { params, env: { isDev }, app: { $storyapi } }
  ) {
    const { lang } = params
    if ($storyapi) {
      const token = $storyapi.accessToken || process.env.STORYBLOK_API_KEY
      await dispatch('informations/load', {
        token,
        isDev,
        language: lang
      })
    }
  }
}
