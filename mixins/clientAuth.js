import parseToken from '~/assets/js/parseToken'

export default {
  created() {
    if (this.$isServer) {
      return
    }
    this.$store.commit('SET_AUTH_TOKEN', parseToken())
    this.$store.commit('SET_UA', window.navigator.userAgent)
    this.$store.dispatch('initAuth')
    this.$store.dispatch('getOauthData')
  }
}
