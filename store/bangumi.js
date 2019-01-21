import { getAllBangumi, timeline } from '~/api/bangumiApi'

export const state = () => ({
  all: [],
  timeline: {
    list: [],
    year: new Date().getFullYear(),
    noMore: false
  }
})

export const mutations = {
  SET_ALL_BANGUMI(state, data) {
    state.all = data
  },
  SET_TIMELINE(state, data) {
    const temp = state.timeline
    state.timeline.list = temp.list.concat(data.list)
    state.timeline.year = temp.year - 1
    state.timeline.noMore = data.noMore
  }
}

export const actions = {
  async getAllBangumi({ state, commit }) {
    let needLoad = true
    try {
      const lastLoadAt = sessionStorage.getItem('all-bangumi-load-at')
      if (lastLoadAt && Date.now() - lastLoadAt < 3600000) {
        const list = JSON.parse(sessionStorage.getItem('all-bangumi-list'))
        list && commit('SET_ALL_BANGUMI', list)
        needLoad = !(list && list.length)
      }
    } catch (e) {}
    if (state.all.length || !needLoad) {
      return
    }
    const data = await getAllBangumi(this)
    commit('SET_ALL_BANGUMI', data)
    try {
      sessionStorage.setItem('all-bangumi-load-at', Date.now())
      sessionStorage.setItem('all-bangumi-list', JSON.stringify(data))
    } catch (e) {}
  },
  async getTimeline({ state, commit }) {
    if (state.timeline.noMore) {
      return
    }
    const { data } = await timeline(this, {
      year: state.timeline.year
    })
    data && commit('SET_TIMELINE', data)
  }
}

export const getters = {}
