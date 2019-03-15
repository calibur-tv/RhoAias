<style lang="scss"></style>

<template>
  <div id="wx-app-post">
    <PostContent :post="post" :user="user" :bangumi="bangumi" />
  </div>
</template>

<script>
import { getPostInfo } from '~/api/postApi'
import PostContent from '~/components/post/PostContent'

export default {
  name: 'WxAppPost',
  components: {
    PostContent
  },
  props: {
    id: {
      require: true,
      type: String
    }
  },
  data() {
    return {
      post: null,
      user: null,
      bangumi: null
    }
  },
  asyncData({ store, params, app, error }) {
    const { id } = params
    return getPostInfo(app, { id, only: 0 })
      .then(data => {
        const { post, bangumi } = data
        store.commit('social/SET_STATE', {
          type: 'post',
          id,
          data: {
            like: post.liked,
            reward: post.rewarded,
            mark: post.marked,
            like_users: post.like_users,
            mark_users: post.mark_users,
            reward_users: post.reward_users
          }
        })
        store.commit('social/SET_STATE', {
          type: 'bangumi',
          id: bangumi.id,
          data: {
            follow: bangumi.followed
          }
        })
        return {
          post,
          bangumi,
          user: data.user
        }
      })
      .catch(e => {
        error({
          statusCode: e.statusCode,
          message: e.message
        })
      })
  }
}
</script>
