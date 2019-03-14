export default {
  async fetch({ store }) {
    await store.dispatch('initAuth')
  }
}
