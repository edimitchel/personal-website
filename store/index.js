export const actions = {
  async nuxtServerInit({ dispatch }, { params, env: { isDev } }) {
    const { lang } = params
    const token = process.env.STORYBLOK_API_KEY
    await dispatch('informations/load', {
      token,
      isDev,
      language: lang
    })
  }
}
