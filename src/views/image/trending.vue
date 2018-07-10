<template>
  <div id="image-trending">
    <div class="tabs">
      <button @click="switchTab('news')" :class="{ 'active': sort === 'news' }">最新上传</button>
      <button @click="switchTab('active')" :class="{ 'active': sort === 'active' }">最近讨论</button>
      <button @click="switchTab('hot')" :class="{ 'active': sort === 'hot' }">最多喜欢</button>
    </div>
    <image-waterfall-flow
      :list="images.list"
      :no-more="images.noMore"
      :loading="images.loading"
      @load="loadMore"
    ></image-waterfall-flow>
  </div>
</template>

<script>
  import ImageWaterfallFlow from '~/components/image/ImageWaterfallFlow'

  export default {
    name: 'image-trending',
    async asyncData ({ store, route, ctx }) {
      const sort = route.params.sort
      if (['news', 'active', 'hot'].indexOf(sort) === -1) {
        const error = new Error()
        error.code = 404
        throw error
      }
      await store.dispatch('trending/getTrending', {
        type: 'image',
        sort,
        ctx,
        take: 12
      })
    },
    components: {
      ImageWaterfallFlow
    },
    head () {
      return {
        title: '相册'
      }
    },
    computed: {
      images () {
        return this.$store.state.trending.type === 'image'
          ? this.$store.state.trending[this.sort]
          : []
      }
    },
    data () {
      return {
        sort: this.$route.params.sort
      }
    },
    methods: {
      async switchTab (tab) {
        this.sort = tab
        try {
          await this.$store.dispatch('trending/getTrending', {
            type: 'image',
            sort: tab,
            ctx: this
          })
        } catch (e) {
          this.$toast.error(e)
        }
      },
      async loadMore () {
        try {
          await this.$store.dispatch('trending/loadMore', {
            type: 'image',
            sort: this.sort,
            take: 12,
            ctx: this
          })
        } catch (e) {
          this.$toast.error(e)
        }
      }
    }
  }
</script>
