import Api from '~/api/appApi'

export default {
  namespaced: true,
  state: () => ({
    download: null,
    notice: null
  }),
  mutations: {
    SET_DOWNLOAD_URL(state, data) {
      state.download = data
    },
    SET_NOTICE(state, data) {
      state.notice = data
    }
  },
  actions: {
    async getDownloadUrl({ commit }, { type }) {
      const api = new Api()
      const data = await api.downloadUrl({
        type
      })
      commit('SET_DOWNLOAD_URL', data)
    },
    async getNotice({ commit }, { id }) {
      const api = new Api()
      const data = await api.notice({ id })
      commit('SET_NOTICE', data)
    }
  },
  getters: {}
}
