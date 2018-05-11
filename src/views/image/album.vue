<style lang="scss">
  #image-album {
    .container {
      height: 80vh;
      padding-top: 200px;
      text-align: center;
      font-size: 12px;
    }
  }
</style>

<template>
  <div id="image-album">
    <div class="container">
      页面施工中...
    </div>
  </div>
</template>

<script>
  export default {
    name: 'image-album',
    async asyncData ({ store, route, ctx }) {
      await store.dispatch('image/getAlbumData', {
        ctx,
        id: route.params.id
      })
    }
  }
</script>
