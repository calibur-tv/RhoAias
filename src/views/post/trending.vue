<template>
  <div id="post-trending">
    <div class="tabs">
      <button @click="switchTab('news')" :class="{ 'active': sort === 'news' }">最新</button>
      <button @click="switchTab('active')" :class="{ 'active': sort === 'active' }">动态</button>
      <button @click="switchTab('hot')" :class="{ 'active': sort === 'hot' }">热门</button>
    </div>
    <ul>
      <post-flow-item
        v-for="(item, index) in post.list"
        :key="`${item.id}-${index}`"
        :item="item"
      ></post-flow-item>
    </ul>
    <more-btn
      :no-more="post.noMore"
      :loading="post.loading"
      :length="post.list.length"
      @fetch="fetchData"
    ></more-btn>
  </div>
</template>

<script>
  import PostFlowItem from '~/components/post/PostFlowItem'

  export default {
    name: 'v-post-trending',
    async asyncData ({ store, route, ctx }) {
      const sort = route.params.sort
      if (['news', 'active', 'hot'].indexOf(sort) === -1) {
        const error = new Error()
        error.code = 404
        throw error
      }
      await store.dispatch('trending/getTrending', {
        type: 'post',
        sort,
        ctx
      })
    },
    components: {
      PostFlowItem
    },
    computed: {
      post () {
        return this.$store.state.trending.type === 'post'
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
      async fetchData () {
        try {
          await this.$store.dispatch('trending/loadMore', {
            type: 'post',
            sort: this.sort,
            ctx: this
          })
        } catch (e) {
          this.$toast.error(e)
        }
      },
      async switchTab (tab) {
        this.sort = tab
        try {
          await this.$store.dispatch('trending/getTrending', {
            type: 'post',
            sort: tab,
            ctx: this
          })
        } catch (e) {
          this.$toast.error(e)
        }
      }
    }
  }
</script>
