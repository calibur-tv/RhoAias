<template>
  <div id="post-trending">
    <div class="tabs">
      <a href="/post/trending/news" :class="{ 'active': sort === 'news' }">最新</a>
      <a href="/post/trending/active" :class="{ 'active': sort === 'active' }">动态</a>
      <a href="/post/trending/hot" :class="{ 'active': sort === 'hot' }">热门</a>
    </div>
    <ul>
      <post-flow-item
        v-for="item in post.list"
        :key="item.id"
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
  import PostApi from '~/api/postApi'
  import PostFlowItem from '~/components/post/PostFlowItem'

  export default {
    name: 'v-post-trending',
    async asyncData ({ store, route, ctx }) {
      await store.dispatch('trending/getTrending', {
        type: 'post',
        sort: route.params.sort,
        api: new PostApi(ctx)
      })
    },
    components: {
      PostFlowItem
    },
    computed: {
      sort () {
        return this.$route.params.sort
      },
      post () {
        return this.$store.state.trending[this.sort]
      }
    },
    methods: {
      async fetchData () {
        try {
          await this.$store.dispatch('trending/loadMore', {
            type: 'post',
            sort: this.sort,
            api: new PostApi(this)
          })
        } catch (e) {
          this.$toast.error(e)
        }
      }
    }
  }
</script>
