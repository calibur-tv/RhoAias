<template>
  <div id="bangumi-post-flow">
    <ul>
      <post-flow-item
        v-for="item in postList"
        :key="item.id"
        :item="item"
      ></post-flow-item>
    </ul>
    <more-btn
      v-if="posts"
      :no-more="posts.noMore"
      :loading="posts.loading"
      :length="postList.length"
      @fetch="loadMore"
    >
      <button @click="openCreatePostModal">发表《{{ info.name }}》的第一个帖子</button>
    </more-btn>
  </div>
</template>

<script>
  import PostFlowItem from '~/components/post/PostFlowItem'

  export default {
    name: 'v-bangumi-post-flow',
    components: {
      PostFlowItem
    },
    computed: {
      info () {
        return this.$store.state.bangumi.info
      },
      posts () {
        return this.$store.state.trending.type === 'post'
          ? this.$store.state.trending.active
          : null
      },
      topPosts () {
        return this.$store.state.bangumi.topPosts
      },
      postList () {
        return this.posts
          ? this.topPosts.concat(this.posts.list)
          : this.topPosts
      }
    },
    methods: {
      async getData () {
        try {
          await this.$store.dispatch('trending/getTrending', {
            type: 'post',
            sort: 'active',
            ctx: this,
            bangumiId: this.info.id
          })
        } catch (e) {
          this.$toast.error(e)
        }
      },
      async loadMore () {
        try {
          await this.$store.dispatch('trending/loadMore', {
            type: 'post',
            sort: 'active',
            ctx: this,
            bangumiId: this.info.id
          })
        } catch (e) {
          this.$toast.error(e)
        }
      },
      openCreatePostModal () {
        if (this.$store.state.login) {
          this.$channel.$emit('drawer-open-write-post')
        } else {
          this.$channel.$emit('sign-in')
        }
      }
    }
  }
</script>
