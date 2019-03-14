<style lang="scss">
</style>

<template>
  <div id="wx-app-idol-buy">
    <div class="container">
      <IdolProductOrderList :idol-id="$route.params.id" />
    </div>
  </div>
</template>

<script>
import IdolProductOrderList from '~/components/idol/IdolProductOrderList'

export default {
  name: 'WxAppIdolBuy',
  components: {
    IdolProductOrderList
  },
  async fetch({ store, params }) {
    await store.dispatch('flow/initData', {
      func: 'getIdolProductOrders',
      type: 'page',
      sort: 'news',
      id: params.id
    })
  }
}
</script>
