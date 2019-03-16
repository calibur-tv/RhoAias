<style lang="scss">
#post-show {
  .content-footer {
    text-align: center;
    margin-bottom: 30px;
  }
}
</style>

<template>
  <div id="post-show">
    <PostContent :post="post" :user="master" :bangumi="bangumi" />
    <div class="content-footer">
      <SocialPanel
        :id="post.id"
        :is-creator="post.is_creator"
        :is-mine="isMaster"
        type="post"
      />
    </div>
    <div class="hr" />
    <div class="container">
      <BangumiPanel :bangumi="bangumi" />
    </div>
    <div class="hr" />
    <div class="container">
      <CommentMain
        :id="id"
        :only-see-master="onlySeeMaster"
        :bottom-append-comment="false"
        :lazy="false"
        :master-id="master.id"
        type="post"
      >
        <div slot="header" />
        <PostCommentForm
          :id="id"
          slot="reply-form"
          slot-scope="{ close }"
          @close="close"
        />
      </CommentMain>
    </div>
    <ShareBtn :share-data="share_data" />
  </div>
</template>

<script>
import PostContent from '~/components/post/PostContent'
import CommentMain from '~/components/comments/CommentMain'
import PostCommentForm from '~/components/post/PostCommentForm'
import SocialPanel from '~/components/common/SocialPanel'
import BangumiPanel from '~/components/panel/BangumiPanel'
import ShareBtn from '~/components/common/ShareBtn'
import { getPostInfo } from '~/api/postApi'

export default {
  name: 'PostShow',
  components: {
    SocialPanel,
    CommentMain,
    BangumiPanel,
    PostCommentForm,
    ShareBtn,
    PostContent
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      post: null,
      bangumi: null,
      master: null,
      share_data: null
    }
  },
  computed: {
    onlySeeMaster() {
      return !!parseInt(this.$route.query.only, 10)
    },
    isMaster() {
      if (!this.$store.state.login) {
        return false
      }
      return this.$store.state.user.id === this.master.id
    }
  },
  asyncData({ query, store, params, app, error }) {
    const { id } = params
    return getPostInfo(app, {
      id,
      only: query.only ? (parseInt(query.only, 10) ? 1 : 0) : 0
    })
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
          master: data.user,
          share_data: data.share_data
        }
      })
      .catch(e => {
        error({
          statusCode: e.statusCode,
          message: e.message
        })
      })
  },
  async fetch({ store, query, params }) {
    try {
      await store.dispatch('comment/getMainComments', {
        id: params.id,
        type: 'post',
        onlySeeMaster: query.only ? (parseInt(query.only, 10) ? 1 : 0) : 0,
        seeReplyId: query['comment-id']
      })
    } catch (e) {
      // do nothing
    }
  },
  head() {
    return {
      title: this.post.title,
      script: [
        {
          hid: 'share-data',
          innerHTML: JSON.stringify(this.share_data),
          type: 'application/json'
        }
      ]
    }
  }
}
</script>
