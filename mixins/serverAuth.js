import parseToken from '~/assets/js/parseToken'

export default {
  async fetch({ store, req }) {
    store.commit('SET_AUTH_TOKEN', parseToken(req))
    await store.dispatch('initAuth')
  }
}
