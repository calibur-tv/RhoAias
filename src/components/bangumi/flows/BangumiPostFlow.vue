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
      :no-more="posts.noMore"
      :loading="loading"
      :length="postList.length"
      @fetch="getPost"
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
        return this.$store.state.bangumi.posts
      },
      topPosts () {
        return this.$store.state.bangumi.topPosts
      },
      postList () {
        return this.topPosts.concat(this.posts.list)
      }
    },
    data () {
      return {
        loading: false
      }
    },
    methods: {
      async getPost () {
        if (this.loading) {
          return
        }
        this.loading = true

        try {
          await this.$store.dispatch('bangumi/getPosts', {
            ctx: this,
            id: this.info.id
          })
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.loading = false
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
