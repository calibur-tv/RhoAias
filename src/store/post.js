import Api from '~/api/postApi'

export default {
  namespaced: true,
  state: () => ({
    trending: {
      take: 10,
      new: {
        data: [],
        noMore: false
      },
      hot: {
        data: [],
        noMore: false
      }
    },
    show: {
      take: 10,
      info: {
        bangumi: null,
        user: null,
        post: null
      },
      data: {
        total: 0,
        list: [],
        noMore: false
      }
    }
  }),
  mutations: {
    followBangumi (state, { id, result }) {
      if (state.show.info.post.id === id) {
        state.show.info.bangumi.followed = result
      }
    },
    setPost (state, { data, reset }) {
      state.show.data = {
        list: reset ? data.list : state.show.data.list.concat(data.list),
        noMore: reset ? (data.list.length < state.show.take - 1) : (data.list.length < state.show.take),
        total: data.total
      }
      if (reset) {
        state.show.info = {
          bangumi: data.bangumi,
          user: data.user,
          post: data.post
        }
      }
    },
    setComment (state, { postId, data }) {
      state.show.data.list.forEach((item, index) => {
        if (item.id === postId) {
          state.show.data.list[index].comments.push(data)
          state.show.data.list[index].comment_count++
        }
      })
    },
    setComments (state, { postId, data }) {
      state.show.data.list.forEach((post, index) => {
        if (post.id === postId) {
          state.show.data.list[index].comments = state.show.data.list[index].comments.concat(data)
        }
      })
    },
    delPost (state, postId) {
      if (postId === state.show.info.post.id) {
        return
      }
      state.show.data.list.forEach((item, index) => {
        if (item.id === postId) {
          state.show.data.list.splice(index, 1)
          state.show.data.total--
        }
      })
    },
    delComment (state, { postId, commentId }) {
      state.show.data.list.forEach((post, index) => {
        if (post.id === postId) {
          state.show.data.list[index].comments.forEach((comment, subIndex) => {
            if (comment.id === commentId) {
              state.show.data.list[index].comments.splice(subIndex, 1)
              state.show.data.list[index].comment_count--
            }
          })
        }
      })
    },
    setTrending (state, { data, sort, reset }) {
      state.trending[sort] = {
        data: reset ? data : state.trending[sort].data.concat(data),
        noMore: data.length < state.trending.take
      }
    },
    TOGGLE_LIKE (state, { id }) {
      if (id === state.show.info.post.id) {
        const result = !state.show.info.post.liked
        state.show.info.post.liked = result
        result ? state.show.info.post.like_count++ : state.show.info.post.like_count--
      } else {
        state.show.data.list.forEach((item, index) => {
          if (item.id === id) {
            const result = !state.show.data.list[index].liked
            state.show.data.list[index].liked = result
            result ? state.show.data.list[index].like_count++ : state.show.data.list[index].like_count--
          }
        })
      }
    },
    TOGGLE_MARK (state, result) {
      state.show.info.post.marked = result
      result ? state.show.info.post.mark_count++ : state.show.info.post.mark_count--
    },
    REPLY_POST (state, data) {
      state.show.data.list.push(data)
      state.show.info.post.comment_count++
      state.show.data.total++
      const images = data.images
      if (images.length) {
        state.show.info.post.previewImages = state.show.info.post.previewImages.concat(images)
      }
    }
  },
  actions: {
    async getPost ({ state, commit }, { id, ctx, only, reply, reset = false }) {
      const api = new Api(ctx)
      const data = await api.show({
        id,
        only,
        seenIds: reset ? null : state.show.data.list.length ? state.show.data.list.map(item => item.id).join(',') : null,
        take: state.show.take,
        replyId: reset ? reply : null
      })
      data && commit('setPost', { data, reset })
    },
    async getComments ({ state, commit }, { postId }) {
      const list = state.show.data.list
      let maxId = 0
      let post
      if (list.length) {
        list.forEach(item => {
          if (item.id === postId) {
            post = item
          }
        })
      }
      if (post && post.comments.length) {
        maxId = post.comments[post.comments.length - 1].id
      }
      const api = new Api()
      const data = await api.comments({ postId, maxId })
      data && commit('setComments', { postId, data })
    },
    async setComment ({ commit }, { postId, targetUserId, content, ctx }) {
      const api = new Api(ctx)
      const data = await api.comment({ postId, targetUserId, content })
      data && commit('setComment', { data, postId })
    },
    // eslint-disable-next-line no-empty-pattern
    async create ({}, params) {
      const api = new Api(params.ctx)
      const id = await api.create(params)
      return id
    },
    async reply ({ commit }, params) {
      const api = new Api(params.ctx)
      const data = await api.reply(params)
      data && commit('REPLY_POST', data)
    },
    async deletePost ({ commit }, { ctx, id }) {
      const api = new Api(ctx)
      await api.deletePost(id)
      commit('delPost', id)
    },
    async deleteComment ({ commit }, { ctx, postId, commentId }) {
      const api = new Api(ctx)
      await api.deleteComment({
        postId, commentId
      })
      commit('delComment', { postId, commentId })
    },
    async getTrending ({ state, commit }, { sort, ctx, reset = false }) {
      if (state.trending[sort].noMore && !reset) {
        return
      }
      const api = new Api(ctx)
      const data = await api.trending({
        sort,
        take: state.trending.take,
        seenIds: reset ? null : state.trending[sort].data.length ? state.trending[sort].data.map(item => item.id).join(',') : null
      })
      data && commit('setTrending', { sort, data, reset })
    },
    async toggleLike ({ commit }, { ctx, id }) {
      commit('TOGGLE_LIKE', { id })
      const api = new Api(ctx)
      await api.toggleLike(id)
    },
    async toggleMark ({ commit }, { ctx, id }) {
      const api = new Api(ctx)
      const result = await api.toggleMark(id)
      commit('TOGGLE_MARK', result)
    }
  },
  getters: {}
}
