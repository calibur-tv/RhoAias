import Api from '~/api/bangumiApi'
import CartoonRoleApi from '~/api/cartoonRoleApi'

export default {
  namespaced: true,
  state: () => ({
    follows: null,
    released: [],
    timeline: {
      list: [],
      year: new Date().getFullYear(),
      noMore: false
    },
    category: {
      list: [],
      noMore: false,
      page: 0,
      take: 10,
      total: 0
    },
    tags: [],
    info: null,
    posts: {
      list: [],
      total: 0,
      noMore: false,
      type: 'new'
    },
    videos: {
      list: [],
      total: 0,
      has_season: false
    },
    roles: {
      id: 0,
      list: [],
      noMore: false
    },
    cartoon: {
      page: 0,
      take: 12,
      sort: 'desc',
      total: 0,
      list: [],
      noMore: false
    },
    topPosts: []
  }),
  mutations: {
    selectTag (state, index) {
      const tag = state.tags[index]
      tag.selected = !tag.selected
      state.tags[index] = tag
    },
    ADD_ROLE_STATE (state, { roleId, hasStar }) {
      state.roles.data.forEach((item, index) => {
        if (item.id === roleId) {
          if (hasStar) {
            state.roles.data[index].has_star++
          } else {
            state.roles.data[index].has_star = 1
            state.roles.data[index].fans_count++
          }
          state.roles.data[index].star_count++
        }
      })
    },
    SET_FOLLOW (state, { followed, self }) {
      state.info.followed = followed
      followed ? state.info.count_like++ : state.info.count_like--
      if (followed) {
        state.info.followers.unshift(self)
      } else {
        state.info.followers.forEach((user, index) => {
          if (user.zone === self.zone) {
            state.info.followers.splice(index, 1)
          }
        })
      }
    },
    SET_RELEASED (state, data) {
      state.released = data
    },
    SET_TIMELINE (state, data) {
      const temp = state.timeline
      state.timeline.list = temp.list.concat(data.list)
      state.timeline.year = temp.year - 1
      state.timeline.noMore = data.noMore
    },
    SET_TAGS (state, { tags, id }) {
      const ids = id ? id.split('-') : undefined
      tags.forEach((tag, index) => {
        tags[index].selected = ids ? ids.indexOf(tag.id.toString()) !== -1 : false
      })
      state.tags = tags
    },
    SET_CATEGORY (state, data) {
      state.category.list = state.category.list.concat(data.list)
      state.category.noMore = data.noMore
      state.category.total = data.total
      state.category.page++
    },
    SET_POSTS (state, data) {
      state.posts.list = state.posts.list.concat(data.list)
      state.posts.total = data.total
      state.posts.noMore = data.noMore
    },
    SET_TOP_POST (state, data) {
      state.topPosts = data
    },
    SET_BANGUMI_INFO (state, data) {
      state.info = data
    },
    SET_VIDEOS (state, data) {
      state.videos.list = data.videos
      state.videos.total = data.total
      state.videos.has_season = data.has_season
    },
    SET_ROLES (state, { data, bangumiId }) {
      state.roles.list = data
      state.roles.noMore = true
      state.roles.id = bangumiId
    },
    SET_BANGUMI_CARTOON (state, data) {
      state.cartoon.list = state.cartoon.list.concat(data.list)
      state.cartoon.noMore = data.noMore
      state.cartoon.total = data.total
      state.cartoon.page = state.cartoon.page + 1
    },
    REVERSE_CARTOON (state, { sort }) {
      state.cartoon.list = state.cartoon.list.reverse()
      state.cartoon.sort = sort
    },
    RESET_CARTOON (state, { sort }) {
      state.cartoon = {
        page: 0,
        take: 12,
        sort,
        total: 0,
        list: [],
        noMore: false
      }
    }
  },
  actions: {
    async getTags ({ state, commit }, { id, ctx }) {
      if (state.tags.length) {
        return
      }
      const api = new Api(ctx)
      const tags = await api.tags()
      tags && commit('SET_TAGS', { tags, id })
    },
    async getBangumi ({ commit }, { ctx, id }) {
      const api = new Api(ctx)
      const data = await api.show(id)
      data && commit('SET_BANGUMI_INFO', data)
    },
    async getVideos ({ commit }, { id, ctx }) {
      const api = new Api(ctx)
      const data = await api.videos(id)
      data && commit('SET_VIDEOS', data)
    },
    async getRoles ({ state, commit }, { bangumiId, ctx }) {
      if (state.roles.id === bangumiId) {
        return state.roles.data
      }
      const api = new Api(ctx)
      const data = await api.roles({ bangumiId })
      if (data) {
        commit('SET_ROLES', { data, bangumiId })
        return data
      }
    },
    async follow ({ commit, rootState }, { ctx, id }) {
      const api = new Api(ctx)
      const followed = await api.follow(id)
      commit('SET_FOLLOW', {
        followed,
        self: {
          id: rootState.user.id,
          zone: rootState.user.zone,
          avatar: rootState.user.avatar,
          nickname: rootState.user.nickname
        }
      })
    },
    async getReleased ({ state, commit }, ctx) {
      if (state.released.length) {
        return
      }
      const api = new Api(ctx)
      const data = await api.released()
      data && commit('SET_RELEASED', data)
    },
    async getTimeline ({ state, commit }, ctx) {
      if (state.timeline.noMore) {
        return
      }
      const api = new Api(ctx)
      const data = await api.timeline({
        year: state.timeline.year
      })
      data && commit('SET_TIMELINE', data)
    },
    async getCategory ({ state, commit }, { id, ctx }) {
      const api = new Api(ctx)
      const data = await api.category({
        id,
        page: state.category.page,
        take: state.category.take
      })
      data && commit('SET_CATEGORY', data)
    },
    async getPosts ({ state, commit }, { id, take, type, ctx }) {
      if (state.posts.noMore) {
        return
      }
      const posts = state.posts.list
      const api = new Api(ctx)
      const data = await api.posts({
        id,
        take,
        type,
        maxId: posts.length ? posts[posts.length - 1].id : 0
      })
      data && commit('SET_POSTS', data)
    },
    async starRole ({ commit }, { bangumiId, roleId, ctx, hasStar }) {
      const api = new CartoonRoleApi(ctx)
      try {
        await api.star({ bangumiId, roleId })
        commit('ADD_ROLE_STATE', { roleId, hasStar })
      } catch (e) {}
    },
    async getCartoons ({ state, commit }, { ctx, bangumiId }) {
      const api = new Api(ctx)
      const data = await api.cartoon({
        bangumiId,
        page: state.cartoon.page,
        take: state.cartoon.take,
        sort: state.cartoon.sort
      })
      data && commit('SET_BANGUMI_CARTOON', data)
    },
    async changeCartoonSort ({ state, commit }, { ctx, bangumiId, sort }) {
      if (state.cartoon.noMore) {
        commit('REVERSE_CARTOON', { sort })
        return
      }
      commit('RESET_CARTOON', { sort })
      const api = new Api(ctx)
      const data = await api.cartoon({
        take: state.cartoon.take,
        page: 0,
        bangumiId,
        sort
      })
      data && commit('SET_BANGUMI_CARTOON', data)
    },
    async getTopPosts ({ commit }, { ctx, id }) {
      const api = new Api(ctx)
      const data = await api.getTopPosts({ id })
      commit('SET_TOP_POST', data)
    }
  },
  getters: {}
}
