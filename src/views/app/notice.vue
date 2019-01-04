<style lang="scss">
#app-notice {
  margin-top: 15px;

  .title {
    font-size: 24px;
    line-height: 32px;
    margin-bottom: 10px;
    margin-top: 0;
    font-weight: normal;
    @extend %breakWord;
  }
}
</style>

<template>
  <div id="app-notice">
    <div class="container">
      <h1
        class="title"
        v-text="notice.title"
      />
    </div>
    <json-content :content="notice.content"/>
  </div>
</template>

<script>
import JsonContent from '~/components/jsonEditor/JsonContent'

export default {
  name: 'AppNotice',
  async asyncData({ store, route }) {
    await store.dispatch('app/getNotice', {
      id: route.params.id
    })
  },
  head: {
    title: '公告'
  },
  components: {
    JsonContent
  },
  computed: {
    notice() {
      return this.$store.state.app.notice
    }
  }
}
</script>
