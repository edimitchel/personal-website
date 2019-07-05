import { options } from '@@/package'
import { getSiteInformation } from '../server/data'

export const state = () => {
  const informations = options.availableLangs.reduce((acc, lang) => {
    acc[lang] = {}
    return acc
  }, {})

  return { ...informations, currentLang: options.defaultLang }
}

export const mutations = {
  SET_INFO(state, { lang, informations }) {
    state[lang] = informations
  },
  SET_CURRENT_LANG(state, lang) {
    state.currentLang = lang
  }
}

export const getters = {
  currentLang(state) {
    return state.currentLang
  },
  get(state, getters) {
    return state[getters.currentLang]
  }
}

export const actions = {
  async load({ commit }, { token, isDev, language }) {
    commit('SET_CURRENT_LANG', language)
    const siteInformations = await getSiteInformation({
      token,
      langs: options.availableLangs,
      isDev,
      defaultLang: options.defaultLang
    })

    await Object.entries(siteInformations).forEach(async ([lang, informations]) => {
      await commit('SET_INFO', {
        lang,
        informations
      })
    })
  },
  setCurrentLang({ commit }, lang) {
    commit('SET_CURRENT_LANG', lang)
  }
}
