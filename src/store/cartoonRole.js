import Api from '~/api/cartoonRoleApi'

export default {
  namespaced: true,
  state: () => ({
    trending: {
      data: [],
      noMore: false,
      take: 15
    },
    bangumi: null,
    info: null,
    list: null,
    season: null
  }),
  mutations: {
    SET_DATA (state, data) {
      state.list = data.list
      state.info = data.info
      state.bangumi = data.bangumi
      state.season = data.season
    },
    SET_TRENDING (state, data) {
      state.trending.data = state.trending.data.concat(data)
      state.trending.noMore = data.length < state.trending.take
    }
  },
  actions: {
    async getShow ({ commit }, { id, ctx }) {
      const api = new Api(ctx)
      const data = await api.getShow(id)
      commit('SET_DATA', data)
    },
    async getTrending ({ state, commit }) {
      if (state.trending.noMore) {
        return
      }
      const api = new Api()
      const data = await api.trending({
        seenIds: state.trending.data.length ? state.trending.data.map(item => item.id).join(',') : null
      })
      commit('SET_TRENDING', data)
    }
  },
  getters: {}
}
