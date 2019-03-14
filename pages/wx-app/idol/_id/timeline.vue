<style lang="scss">
</style>

<template>
  <div id="wx-app-idol-timeline">
    <div class="container">
      <IdolTimeline :is-boss="isBoss" :idol="idol" />
    </div>
  </div>
</template>

<script>
import IdolTimeline from '~/components/idol/IdolTimeline'
import { getCartoonRoleInfo } from '~/api/cartoonRoleApi'

export default {
  name: 'WxAppIdolTimeline',
  components: {
    IdolTimeline
  },
  data() {
    return {
      idol: null
    }
  },
  computed: {
    currentUserId() {
      return this.$store.state.login ? this.$store.state.user.id : 0
    },
    isBoss() {
      return this.idol.boss ? this.idol.boss.id === this.currentUserId : false
    }
  },
  async asyncData({ app, store, params, error }) {
    const { id } = params
    return getCartoonRoleInfo(app, { id })
      .then(data => {
        return {
          idol: data.role
        }
      })
      .catch(e => {
        error({
          statusCode: e.statusCode,
          message: e.message
        })
      })
  },
  async fetch({ store, params }) {
    await store.dispatch('flow/initData', {
      func: 'getIdolDraftList',
      type: 'page',
      sort: 'new',
      id: params.id
    })
  }
}
</script>
