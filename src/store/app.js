import Api from '~/api/appApi'

export default {
  namespaced: true,
  state: () => ({
    download: null
  }),
  mutations: {
    SET_DOWNLOAD_URL(state, data) {
      state.download = data
    }
  },
  actions: {
    async getDownloadUrl({ commit }, { type }) {
      const api = new Api()
      const data = await api.downloadUrl({
        type
      })
      commit('SET_DOWNLOAD_URL', data)
    }
  },
  getters: {}
}
