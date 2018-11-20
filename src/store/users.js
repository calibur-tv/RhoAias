import Api from '~/api/userApi'
import ScoreApi from '~/api/scoreApi'
import QuestionApi from '~/api/questionApi'

export default {
  namespaced: true,
  state: () => ({
    show: null,
    bangumis: [],
    fetchedBangumiZone: '',
    notifications: {
      checked: 0,
      take: 10,
      list: [],
      total: 0,
      noMore: false
    },
    drafts: {
      score: {
        list: [],
        total: 0,
        noMore: false,
        loading: false
      },
      answer: {
        list: [],
        total: 0,
        noMore: false,
        loading: false
      }
    },
    bookmark: {
      post: {
        noMore: false,
        loading: false,
        list: [],
        total: 0,
        page: 0
      },
      image: {
        noMore: false,
        loading: false,
        list: [],
        total: 0,
        page: 0
      },
      score: {
        noMore: false,
        loading: false,
        list: [],
        total: 0,
        page: 0
      },
      answer: {
        noMore: false,
        loading: false,
        list: [],
        total: 0,
        page: 0
      },
      video: {
        noMore: false,
        loading: false,
        list: [],
        total: 0,
        page: 0
      }
    }
  }),
  mutations: {
    SET_BOOKMARK_LOADING(state, type) {
      state.bookmark[type].loading = true
    },
    SET_BOOKMARKS(state, { data, type }) {
      state.bookmark[type].list = state.bookmark[type].list.concat(data.list)
      state.bookmark[type].noMore = data.noMore
      state.bookmark[type].total = data.total
      state.bookmark[type].page++
      state.bookmark[type].loading = false
    },
    SET_USER_INFO(state, data) {
      state.show = data
    },
    SET_USER_FOLLOW_BANGUMI(state, { data, zone }) {
      state.bangumis = data
      state.fetchedBangumiZone = zone
    },
    SET_NOTIFICATIONS(state, data) {
      state.notifications.list = state.notifications.list.concat(data.list)
      state.notifications.total = data.total
      state.notifications.noMore = data.noMore
      state.notifications.checked = 0
    },
    READ_NOTIFICATION(state, id) {
      state.notifications.list.forEach((message, index) => {
        if (message.id === id && !message.checked) {
          state.notifications.list[index].checked = true
          state.notifications.checked++
        }
      })
    },
    READ_ALL_NOTIFICATION(state) {
      state.notifications.list.forEach((message, index) => {
        state.notifications.list[index].checked = true
      })
      state.notifications.checked = 88888888
    },
    CLEAR_NOTIFICATIONS(state) {
      state.notifications = {
        checked: 0,
        take: 10,
        noMore: false,
        total: 0,
        list: []
      }
    },
    SET_DRAFT_LOADING(state, type) {
      state.drafts[type].loading = true
    },
    SET_USER_DRAFT(state, { data, type }) {
      state.drafts[type].noMore = data.noMore
      state.drafts[type].loading = false
      state.drafts[type].total = data.total
      state.drafts[type].list = state.drafts[type].list.concat(data.list)
    }
  },
  actions: {
    async getUser({ state, commit }, { ctx, zone }) {
      if (state.show && state.show.zone === zone) {
        return
      }
      const api = new Api(ctx)
      const data = await api.getUserInfo({ zone })
      commit('SET_USER_INFO', data)
    },
    async getFollowBangumis({ state, commit }, { ctx, zone }) {
      if (state.fetchedBangumiZone === zone) {
        return state.bangumis
      }
      const api = new Api(ctx)
      const data = await api.followBangumis(zone)
      data && commit('SET_USER_FOLLOW_BANGUMI', { data, zone })
    },
    async daySign({ rootState }, { ctx }) {
      if (rootState.user.signed) {
        return
      }
      const api = new Api(ctx)
      return await api.daySign()
    },
    async getNotifications({ state, commit }, { ctx, reset }) {
      if (reset) {
        commit('CLEAR_NOTIFICATIONS')
      }
      const length = state.notifications.list.length
      if (state.notifications.noMore) {
        return
      }
      const api = new Api(ctx)
      const data = await api.getNotifications({
        minId: length ? state.notifications.list[length - 1].id : null,
        take: state.notifications.take
      })
      data && commit('SET_NOTIFICATIONS', data)
    },
    async readMessage({ state, commit }, { ctx, id }) {
      let msg = null
      state.notifications.list.forEach(message => {
        if (message.id === id && !message.checked) {
          msg = message
        }
      })
      if (msg) {
        const api = new Api(ctx)
        await api.readMessage(id)
        commit('READ_NOTIFICATION', id)
      }
    },
    async readAllMessage({ commit }, ctx) {
      const api = new Api(ctx)
      await api.readAllMessage()
      commit('READ_ALL_NOTIFICATION')
    },
    async getUserDrafts({ state, commit }, { type, ctx }) {
      if (!state.drafts[type]) {
        return
      }
      if (state.drafts[type].noMore || state.drafts[type].loading) {
        return
      }
      let api
      if (type === 'score') {
        api = new ScoreApi(ctx)
      } else if (type === 'answer') {
        api = new QuestionApi(ctx)
      }
      commit('SET_DRAFT_LOADING', type)
      const data = await api.drafts()
      commit('SET_USER_DRAFT', {
        data: {
          list: data,
          noMore: true,
          total: 0
        },
        type
      })
    },
    async getBookmarks({ state, commit }, { type, init, ctx }) {
      if (state.bookmark[type].page && init) {
        return
      }
      if (state.bookmark[type].loading || state.bookmark[type].noMore) {
        return
      }
      const api = new Api(ctx)
      commit('SET_BOOKMARK_LOADING', type)
      const data = await api.getBookmarks({
        page: state.bookmark[type].page,
        take: 16,
        type
      })
      data && commit('SET_BOOKMARKS', { type, data })
    }
  },
  getters: {}
}
