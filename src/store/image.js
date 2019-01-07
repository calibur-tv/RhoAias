import Api from '~/api/imageApi'

export default {
  namespaced: true,
  state: () => ({
    show: null,
    albums: []
  }),
  mutations: {
    SOCIAL_TOGGLE(state, { key, value, user }) {
      state.show[`${key}ed`.replace('ee', 'e')] = value
      if (value) {
        state.show[`${key}_users`].total++
        state.show[`${key}_users`].list.unshift(user)
      } else {
        state.show[`${key}_users`].total--
        state.show[`${key}_users`].list.forEach((item, index) => {
          if (item.id === user.id) {
            state.show[`${key}_users`].list.splice(index, 1)
          }
        })
      }
    },
    FOLLOW_ALBUM_BANGUMI(state, { result }) {
      state.show.bangumi.followed = result
    },
    SET_IMAGE_INFO(state, data) {
      state.show = data
    },
    DELETE_ALBUM_IMAGE(state, { index }) {
      state.show.images.splice(index, 1)
      state.show.image_count--
    },
    SORT_ALBUM_IMAGE(state, result) {
      state.show.images = result
    },
    SET_USER_IMAGE_ALBUMS(state, data) {
      state.albums = data
    }
  },
  actions: {
    async show({ commit }, { id, ctx }) {
      const api = new Api(ctx)
      const data = await api.show({ id })
      commit('SET_IMAGE_INFO', data)
    },
    async userAlbum({ state, commit }, { ctx }) {
      if (state.albums.length) {
        return
      }
      const api = new Api(ctx)
      const data = await api.getUserAlbums()
      commit('SET_USER_IMAGE_ALBUMS', data)
      return data
    },
    async sortAlbumImage({ state, commit }, { prev, next, ctx, id }) {
      let imageArr = state.show.images.map(_ => _)
      imageArr.splice(prev, 1, ...imageArr.splice(next, 1, imageArr[prev]))
      const result = imageArr.map(_ => _.id).toString()
      const api = new Api(ctx)
      await api.sortAlbum({ id, result })
      commit('SORT_ALBUM_IMAGE', imageArr)
    },
    async deleteAlbumImage({ state, commit }, { index, ctx, id }) {
      let idsArr = state.show.images.map(_ => _.id)
      const imageId = idsArr.splice(index, 1)[0]
      const api = new Api(ctx)
      await api.deleteAlbumImage({ id, result: idsArr.toString(), imageId })
      commit('DELETE_ALBUM_IMAGE', { index })
    }
  },
  getters: {}
}
