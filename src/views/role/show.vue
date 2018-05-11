<style lang="scss">
  #role-show {
    .container {
      height: 80vh;
      padding-top: 200px;
      text-align: center;
      font-size: 12px;
    }
  }
</style>

<template>
  <div id="role-show">
    <div class="container">
      页面施工中...
    </div>
  </div>
</template>

<script>
  export default {
    name: 'role-show',
    async asyncData ({ store, route, ctx }) {
      const id = route.params.id
      await Promise.all([
        store.dispatch('cartoonRole/getRoleInfo', { ctx, id }),
        store.dispatch('cartoonRole/getFansList', {
          ctx,
          bangumiId: 0,
          roleId: id,
          sort: 'new',
          reset: false
        })
      ])
    }
  }
</script>
