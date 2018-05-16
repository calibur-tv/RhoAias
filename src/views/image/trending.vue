<style lang="scss">

</style>

<template>
  <div id="image-trending">
    <div class="tabs">
      <button @click="switchTab('new')" :class="{ 'active': sort === 'new' }">最新上传</button>
      <button @click="switchTab('hot')" :class="{ 'active': sort === 'hot' }">最多喜欢</button>
    </div>
    <image-waterfall
      :loading="loading"
      @fetch="getImages"
    ></image-waterfall>
  </div>
</template>

<script>
  import ImageWaterfall from '~/components/lists/ImageWaterfall'

  export default {
    name: 'image-trending',
    async asyncData ({ store, route, ctx }) {
      await store.dispatch('image/getTrendingImages', {
        sort: route.params.sort,
        ctx,
        force: true
      })
    },
    components: {
      ImageWaterfall
    },
    head () {
      return {
        title: `相册 - ${this.sort === 'new' ? '最新上传' : '最多喜欢'}`
      }
    },
    computed: {
      images () {
        return this.$store.state.image.waterfall
      }
    },
    data () {
      return {
        loading: false,
        sort: this.$route.params.sort
      }
    },
    methods: {
      switchTab (tab) {
        this.sort = tab
        this.getImages(true)
      },
      async getImages (force = false) {
        if (this.loading) {
          return
        }
        this.loading = true
        try {
          await this.$store.dispatch('image/getTrendingImages', {
            sort: this.sort,
            ctx: this,
            force
          })
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>
