<style lang="scss">
#post-show {
  .content-footer {
    text-align: center;
    margin-bottom: 30px;
  }

  .comment-post-btn {
    position: fixed;
    left: 50%;
    margin-left: -37px;
    bottom: 50px;
    width: 74px;
    height: 30px;
    color: #fff;
    background-color: $color-pink-normal;
    border-radius: 15px;
    font-size: 13px;
    z-index: 9;
    box-shadow: 0 2px 5px rgba(26, 26, 26, 0.25);
    transform: translateY(200px);
    transition: 0.4s;

    &.isScrollTop {
      transform: translateY(0);
    }
  }

  .bangumi-panel {
    padding-top: $container-padding;
    padding-bottom: $container-padding;

    .summary {
      font-size: 12px;
      color: #666;
      @include twoline(13px);
    }
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
    <div class="container bangumi-panel">
      <h3 class="sub-title">
        所属番剧：
      </h3>
      <BangumiPanel
        :id="bangumi.id"
        :avatar="bangumi.avatar"
        :name="bangumi.name"
      >
        <p class="summary" v-text="bangumi.summary" />
      </BangumiPanel>
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
        <PostCommentItem
          slot="comment-item"
          slot-scope="{ comment }"
          :post="comment"
          :master-id="master.id"
          :preview="post.preview_images"
        />
        <PostCommentForm
          :id="id"
          slot="reply-form"
          slot-scope="{ close }"
          @close="close"
        />
      </CommentMain>
    </div>
    <ShareBtn :share-data="share_data" />
    <button
      :class="{ isScrollTop }"
      class="comment-post-btn"
      @click="handleReplyBtnClick"
    >
      <i class="iconfont icon-talk" />
      <span>回复</span>
    </button>
  </div>
</template>

<script>
import PostContent from '~/components/post/PostContent'
import CommentMain from '~/components/comments/CommentMain'
import PostCommentItem from '~/components/post/PostCommentItem'
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
    PostCommentItem,
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
      share_data: null,
      lastScroll: 0,
      isScrollTop: true
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
  },
  mounted() {
    window.addEventListener(
      'scroll',
      this.$utils.throttle(() => {
        const scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop
        this.isScrollTop = this.lastScroll > scrollTop
        this.lastScroll = scrollTop
      }, 200)
    )
  },
  methods: {
    handleReplyBtnClick() {
      this.$channel.$emit(`open-create-comment-drawer-post-${this.id}`)
    }
  }
}
</script>
