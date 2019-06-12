export const state = () => ({
  message: [],
  pageName: undefined,
  color: undefined,
  hideMenu: false,
})

export const mutations = {
  setMessage(state, messages) {
    state.message = messages
  },
  setCustomPageName(state, pageName) {
    state.pageName = pageName
  },
  setColor(state, color) {
    state.color = color
  },
  setHideMenu(state, hide) {
    state.hideMenu = hide
  }
}
