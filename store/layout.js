export const state = () => ({
  message: [],
  color: null
})

export const mutations = {
  setMessage(state, messages) {
    state.message = messages
  },
  setColor(state, color) {
    state.color = color
  }
}

export const getters = {
  getMessages(state) {
    return state.messages
  },
  getColor(state) {
    return state.color
  }
}
