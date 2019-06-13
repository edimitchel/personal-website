const defaultImage = require('~/assets/images/self-image.png')

export const state = () => ({
  message: [],
  pageName: undefined,
  color: undefined,
  hideMenu: false,
  headerImage: defaultImage,
  headerCover: undefined
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
  },
  setHeaderImage(state, image) {
    state.headerImage = image
  },
  setDefaultHeaderImage(state) {
    state.headerImage = defaultImage
  },
  setHeaderCover(state, image) {
    state.headerCover = image
  }
}
