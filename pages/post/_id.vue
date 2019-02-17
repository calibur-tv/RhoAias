<style lang="scss">
.post {
  .title {
    color: #000;
    font-size: 18px;
    font-weight: 700;
    line-height: 28px;
    margin: 8px 0 15px;

    .nice_badge {
      float: left;
      height: 22px;
      line-height: 20px;
      color: #fff;
      cursor: default;
      font-size: 12px;
      font-weight: bold;
      text-align: center;
      padding: 1px 6px;
      border-radius: 4px;
      margin: 4px 5px 0 0;
      background-color: $color-pink-deep;
    }
  }

  .user {
    position: relative;
    .avatar {
      float: left;
      margin-right: 9px;
    }

    .tool-btn {
      position: absolute;
      right: 5px;
      top: 0;
      line-height: 16px;
      font-size: 12px;
      color: #535353;
    }

    .summary {
      overflow: hidden;

      .nickname {
        overflow: hidden;
        display: inline-block;
        font-size: 14px;
        color: #333;
      }

      .info {
        line-height: 16px;
        font-size: 12px;
        color: #999;

        span {
          margin-right: 5px;
        }
      }
    }
  }

  .content {
    color: #000;
    font-size: 16px;
    margin: 14px 0 22px;
    line-height: 24px;

    .text-area {
      p {
        margin-bottom: 12px;
      }
    }

    .image-area {
      margin: 16px 0;

      img {
        width: 100%;
        height: auto;
      }
    }
  }

  .tags {
    margin-bottom: -10px;

    > * {
      display: inline-block;
      padding-left: 5px;
      padding-right: 5px;
      height: 18px;
      font-size: 12px;
      border-radius: 9px;
      line-height: 18px;
      background-color: $color-gray-normal;
      color: $color-text-normal;
      margin-right: 5px;
    }

    i {
      margin-right: 2px;
    }
  }

  .footer {
    text-align: center;
    margin-bottom: 30px;

    .comment-post-btn {
      position: fixed;
      left: 50%;
      margin-left: -37px;
      bottom: 50px;
      width: 74px;
      height: 30px;
      line-height: 30px;
      color: #fff;
      background-color: $color-pink-deep;
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
</style>

<template>
  <div id="post-show">
    <div class="container">
      <div class="post">
        <h1 class="title">
          <div
            v-if="post.is_nice"
            class="nice_badge"
          >精</div>
          {{ post.title }}
        </h1>
        <div class="user">
          <nuxt-link
            :to="$alias.user(master.zone)"
            class="avatar">
            <v-img
              :src="master.avatar"
              :avatar="true"
              width="35"
            />
          </nuxt-link>
          <v-popover
            :actions="actions"
            :report-id="id"
            :is-creator="post.is_creator"
            report-type="post"
          >
            <button class="tool-btn">···</button>
          </v-popover>
          <div class="summary">
            <nuxt-link
              :to="$alias.user(master.zone)"
              class="nickname"
              v-text="master.nickname"
            />
            <div class="info">
              <span>第1楼</span>
              <span>·</span>
              <template v-if="total > 1">
                <span>共{{ total }}楼</span>
                <span>·</span>
              </template>
              <v-time v-model="post.created_at"/>
              <span 
                v-if="post.view_count" 
                class="fr">
                <i class="iconfont icon-yuedu"/>
                {{ $utils.shortenNumber(post.view_count) }}
              </span>
            </div>
          </div>
        </div>
        <div class="content">
          <image-preview
            :images="post.images"
            :download="false"
            class="image-area"
          >
            <div
              v-for="(img, idx) in post.images"
              :key="idx"
              class="image-package"
            >
              <v-img
                :src="img.url"
                :full="true"
                :width="img.width"
                :height="img.height"
              />
            </div>
          </image-preview>
          <div
            class="text-area"
            v-html="post.content"
          />
        </div>
        <div class="tags">
          <router-link :to="$alias.bangumi(bangumi.id)">
            <i class="iconfont icon-tag"/>
            <span v-text="bangumi.name"/>
          </router-link>
          <span
            v-for="tag in post.tags"
            :key="tag.id"
            class="tag"
            v-text="tag.name"
          />
        </div>
        <div class="footer">
          <social-panel
            :id="id"
            :is-creator="post.is_creator"
            :is-mine="isMaster"
            type="post"
          />
          <button
            :class="{ isScrollTop }"
            class="comment-post-btn"
            @click="handleReplyBtnClick"
          >
            <i class="iconfont icon-talk"/>
            回复
          </button>
        </div>
      </div>
      <div class="hr"/>
      <comment-main
        :id="id"
        :only-see-master="onlySeeMaster"
        :bottom-append-comment="false"
        :lazy="false"
        :master-id="master.id"
        type="post"
      >
        <div slot="header"/>
        <post-comment-item
          slot="comment-item"
          slot-scope="{ comment }"
          :post="comment"
          :master-id="master.id"
          :preview="post.preview_images"
        />
        <post-comment-form
          slot="reply-form"
          slot-scope="{ close }"
          :id="id"
          @close="close"
        />
      </comment-main>
    </div>
    <div class="hr"/>
    <div class="container bangumi-panel">
      <h3 class="sub-title">所属番剧：</h3>
      <bangumi-panel
        :id="bangumi.id"
        :avatar="bangumi.avatar"
        :name="bangumi.name"
      >
        <p 
          class="summary" 
          v-text="bangumi.summary"/>
      </bangumi-panel>
    </div>
    <share-btn :share-data="share_data"/>
  </div>
</template>

<script>
import CommentMain from '~/components/comments/CommentMain'
import PostCommentItem from '~/components/post/PostCommentItem'
import SocialPanel from '~/components/common/SocialPanel'
import ImagePreview from '~/components/common/ImagePreview/ImagePreview'
import BangumiPanel from '~/components/panel/BangumiPanel'
import VPopover from '~/components/common/Popover'
import PostCommentForm from '~/components/post/PostCommentForm'
import ShareBtn from '~/components/common/ShareBtn'
import { getPostInfo, deletePost } from '~/api/postApi'

export default {
  name: 'PostShow',
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
      .catch(error)
  },
  async fetch({ store, query, params }) {
    try {
      await store.dispatch('comment/getMainComments', {
        id: params.id,
        type: 'post',
        onlySeeMaster: query.only ? (parseInt(query.only, 10) ? 1 : 0) : 0,
        seeReplyId: query['comment-id']
      })
    } catch (e) {}
  },
  components: {
    CommentMain,
    PostCommentItem,
    SocialPanel,
    ImagePreview,
    BangumiPanel,
    PostCommentForm,
    VPopover,
    ShareBtn
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  head() {
    return {
      title: this.post.title
    }
  },
  data() {
    return {
      loadingToggleLike: false,
      loadingToggleMark: false,
      lastScroll: 0,
      isScrollTop: true,
      share_data: null
    }
  },
  computed: {
    total() {
      return this.$store.state.comment.total + 1
    },
    onlySeeMaster() {
      return !!parseInt(this.$route.query.only, 10)
    },
    isMaster() {
      if (!this.$store.state.login) {
        return false
      }
      return this.$store.state.user.id === this.master.id
    },
    actions() {
      const result = [
        {
          name: '回复',
          method: this.handleReplyBtnClick
        }
      ]
      if (this.isMaster) {
        result.push({
          name: '删除',
          method: this.deletePost
        })
      }
      result.push({
        name: this.onlySeeMaster ? '取消只看楼主' : '只看楼主',
        method: this.switchOnlyMaster
      })

      return result
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
    switchOnlyMaster() {
      window.location = this.$alias.post(this.id, {
        only: this.onlySeeMaster ? 0 : 1
      })
    },
    deletePost() {
      this.$confirm('删除后无法找回, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await deletePost(this, { id: this.id })
          window.location.reload()
        })
        .catch(() => {})
    },
    handleReplyBtnClick() {
      this.$channel.$emit(`open-create-comment-drawer-post-${this.id}`)
    }
  }
}
</script>
