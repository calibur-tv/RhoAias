<style lang="scss">
#comment-wrap {
  margin-right: -$container-padding;

  .title {
    margin-top: $container-padding;
    margin-bottom: $container-padding;
    font-size: 17px;
    line-height: 24px;

    span {
      @include half-font(11px, top);
      display: inline-block;
      color: $color-text-light;
      margin: 1px 0 0 -2px;
    }
  }

  .comment-fixed-btn {
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

  .focus-comment-drawer {
    .reply {
      .user {
        padding-top: 5px;

        .avatar {
          float: left;
          margin-right: 9px;
        }

        .summary {
          overflow: hidden;

          .nickname {
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
        font-size: 16px;
        line-height: 24px;
        padding-top: 16px;
        margin-bottom: 16px;
        color: #000;

        .image-area {
          margin: 16px 0;

          img {
            width: 100%;
            height: auto;
          }
        }
      }

      .social {
        margin-bottom: 15px;
        font-size: 12px;

        .reply-liked-btn {
          color: $color-blue-deep;
        }

        button {
          color: #666;
          margin-left: 3px;
        }
      }
    }

    .total {
      height: 40px;
      line-height: 40px;
      color: #000;
      font-size: 16px;
    }

    .comments {
      li {
        padding: 17px 0 13px;
        position: relative;
        @include border-bottom();

        .from-user {
          .avatar {
            float: left;
            display: block;
            margin-right: 9px;
          }

          .summary {
            overflow: hidden;

            .users {
              font-size: 14px;
              margin-bottom: 6px;
              margin-top: 2px;
              line-height: 14px;

              .nickname {
                color: $color-blue-deep;
              }
            }

            .info {
              font-size: 12px;
              line-height: 12px;
              color: #999;
            }
          }
        }

        .main {
          margin-left: 45px;
          padding-top: 10px;

          .content {
            font-size: 14px;
            line-height: 21px;
            word-break: break-all;
          }
        }
      }
    }
  }

  .reply-comment-drawer-wrap {
    textarea {
      width: 100%;
      height: 250px;
      background-color: transparent;
      font-size: 16px;
      line-height: 24px;
      color: #000;
      font-weight: 400;
      z-index: 101;
      padding-left: $container-padding;
      padding-right: $container-padding;
    }
  }

  .append-comment-btn {
    width: 100%;
    padding: 15px 0;
    font-size: 13px;
  }

  .comment-nothing {
    text-align: center;
    margin: 40px 0;
    padding-bottom: 20px;

    img {
      width: 140px;
      height: auto;
      margin-bottom: 15px;
    }

    p {
      font-size: 19px;
      color: $color-text-light;
      margin-bottom: 15px;
    }

    button {
      width: 70px;
      height: 28px;
      border-radius: 14px;
      text-align: center;
      font-size: 13px;
      color: #fff;
      line-height: 28px;
      background-color: $color-red;
    }
  }
}
</style>

<template>
  <div id="comment-wrap">
    <!-- 主列表的头部 -->
    <h3 class="title">
      评论 <span v-if="total">{{ total }}</span>
    </h3>
    <!-- 主列表的 list -->
    <template v-if="list.length">
      <div id="comment-list-wrap">
        <!-- 每条主评论 -->
        <div
          v-for="comment in list"
          :key="comment.id"
          class="comment-item-wrap"
        >
          <!-- 主评论的内容 -->
          <slot
            :comment="comment"
            :reply="handleSubCommentReply"
            name="comment-item"
          >
            <CommentItem
              :type="type"
              :comment="comment"
              :master-id="masterId"
              @delete="deleteCommentCallback"
            />
          </slot>
        </div>
      </div>
      <FlowState
        :no-more="noMore"
        :loading="loadingMainComment"
        :auto="true"
        :fetch="autoLoadMoreMainComment"
      />
      <button
        :class="{ isScrollTop }"
        class="comment-fixed-btn"
        @click="writeComment"
      >
        <i class="iconfont icon-talk" />
        <span>回复</span>
      </button>
    </template>
    <div v-else class="comment-nothing">
      <img src="~assets/img/no-comment.png">
      <p>还没有人发言呢！</p>
      <button @click="writeComment">
        抢沙发
      </button>
    </div>
    <!-- reply detail drawer -->
    <v-drawer
      v-model="openFocusCommentDrawer"
      :header-text="
        `评论列表${
          focusComment && focusComment.floor_count
            ? ` - ${focusComment.floor_count} 楼`
            : ''
        }`
      "
      :backdrop="false"
      from="bottom"
      size="100%"
      class="focus-comment-drawer"
    >
      <template v-if="focusComment">
        <div class="container">
          <div class="reply">
            <div class="user clearfix">
              <nuxt-link
                :to="$alias.user(focusComment.from_user_zone)"
                class="avatar"
              >
                <v-img
                  :src="focusComment.from_user_avatar"
                  :avatar="true"
                  width="35"
                />
              </nuxt-link>
              <div class="summary">
                <nuxt-link
                  :to="$alias.user(focusComment.from_user_zone)"
                  class="nickname"
                  v-text="focusComment.from_user_name"
                />
                <div class="info">
                  <v-time v-model="focusComment.created_at" />
                </div>
              </div>
            </div>
            <div class="content">
              <div class="text-area" v-html="focusComment.content" />
              <div class="image-area">
                <div
                  v-for="(img, idx) in focusComment.images"
                  :key="idx"
                  class="image-package"
                >
                  <v-img
                    :src="img.url"
                    :width="img.width"
                    :height="img.height"
                    mode="contain"
                  />
                </div>
              </div>
            </div>
            <div class="social">
              <button
                :class="[
                  focusComment.liked ? 'reply-liked-btn' : 'reply-like-btn'
                ]"
                @click="toggleFocusCommentLike"
              >
                <i class="iconfont icon-icon_good" />
                <span>{{ focusComment.liked ? '已赞' : '赞' }}</span>
                <span
                  v-if="focusComment.like_count"
                >({{ focusComment.like_count }})</span>
              </button>
              <button class="reply-btn fr" @click="handleCommentBtnClick">
                回复
              </button>
            </div>
          </div>
          <div class="hr" />
          <p class="total">
            {{ focusComment.comments.total }}条回复
          </p>
          <ul class="comments">
            <li v-for="item in focusComment.comments.list" :key="item.id">
              <div class="from-user">
                <nuxt-link
                  :to="$alias.user(item.from_user_zone)"
                  class="avatar"
                >
                  <v-img
                    :src="item.from_user_avatar"
                    :avatar="true"
                    width="35"
                  />
                </nuxt-link>
                <div class="summary">
                  <div class="users oneline">
                    <nuxt-link
                      :to="$alias.user(item.from_user_zone)"
                      class="nickname"
                      v-text="item.from_user_name"
                    />
                    <template v-if="item.to_user_zone">
                      回复
                      <nuxt-link
                        :to="$alias.user(item.to_user_zone)"
                        class="nickname"
                        v-text="item.to_user_name"
                      />
                    </template>
                    :
                  </div>
                  <div class="info">
                    <v-time v-model="item.created_at" />
                  </div>
                </div>
              </div>
              <div class="main">
                <div
                  class="content reply-btn"
                  @click="commentToComment(item)"
                  v-text="item.content"
                />
              </div>
            </li>
          </ul>
        </div>
        <FlowState
          :no-more="focusComment.comments.noMore"
          :loading="loadingSubComment"
          :fetch="loadMoreSubComment"
        />
      </template>
    </v-drawer>
    <!-- reply drawer -->
    <div class="reply-comment-drawer-wrap">
      <v-drawer
        v-model="replyForm.open"
        :header-text="
          currentUserId === replyForm.targetUserId
            ? '回复'
            : `回复：${replyForm.targetUserName}`
        "
        :backdrop="false"
        from="right"
        size="100%"
        submit-text="发送"
        @submit="handleReplySubmit"
      >
        <textarea
          v-model.trim="replyForm.content"
          placeholder="100字以内任意发挥"
          maxlength="100"
        />
      </v-drawer>
    </div>
    <!-- comment drawer -->
    <v-drawer
      v-model="openCreateCommentDrawer"
      from="right"
      size="100%"
      header-text="发表评论"
    >
      <div v-if="openCreateCommentDrawer" class="container">
        <slot :close="closeCommentDrawer" name="reply-form">
          <CommentCreateForm
            v-if="openCreateCommentDrawer"
            :id="id"
            :type="type"
            :master-id="masterId"
            @close="closeCommentDrawer"
            @submit="submitCommentCallback"
          />
        </slot>
      </div>
    </v-drawer>
  </div>
</template>

<script>
import CommentCreateForm from './CommentCreateForm'
import CommentItem from './CommentItem'
import scrollToY from '~/assets/js/scrollToY'
import FlowState from '~/components/flow/FlowState'

export default {
  name: 'VCommentMain',
  components: {
    CommentCreateForm,
    CommentItem,
    FlowState
  },
  props: {
    id: {
      required: true,
      type: [Number, String]
    },
    type: {
      required: true,
      type: String,
      validator: val =>
        ~[
          'post',
          'video',
          'image',
          'score',
          'question',
          'answer',
          'role'
        ].indexOf(val)
    },
    onlySeeMaster: {
      type: Boolean,
      default: false
    },
    masterId: {
      required: true,
      type: Number
    },
    bottomAppendComment: {
      type: Boolean,
      default: true
    },
    auto: {
      type: Boolean,
      default: false
    },
    lazy: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loadingMainComment: false,
      focusCommentId: 0,
      openFocusCommentDrawer: false,
      loadingSubComment: false,
      replyForm: {
        id: '',
        content: '',
        targetUserId: 0,
        targetUserName: '',
        open: false,
        replying: false,
        liking: false
      },
      openCreateCommentDrawer: false,
      lastScroll: 0,
      isScrollTop: true
    }
  },
  computed: {
    store() {
      return this.$store.state.comment
    },
    list() {
      return this.store.list
    },
    noMore() {
      return this.store.noMore
    },
    total() {
      return this.store.total
    },
    focusComment() {
      return this.focusCommentId
        ? this.list.filter(_ => _.id === this.focusCommentId)[0]
        : null
    },
    currentUserId() {
      return this.$store.state.login ? this.$store.state.user.id : 0
    }
  },
  mounted() {
    if (this.auto) {
      this.$channel.$on(`fire-load-comment-${this.type}-${this.id}`, () => {
        this.loadMoreMainComment(true)
        this.$channel.$off(`fire-load-comment-${this.type}-${this.id}`)
      })
    } else {
      this.lazyLoadComment()
    }
    this.$channel.$on('load-all-sub-comment', ({ id }) => {
      this.focusCommentId = id
      this.openFocusCommentDrawer = true
    })
    this.$channel.$on(
      `open-create-comment-drawer-${this.type}-${this.id}`,
      () => {
        if (!this.currentUserId) {
          this.$channel.$emit('sign-in')
          return
        }
        this.openCreateCommentDrawer = true
      }
    )
    this.$channel.$on(
      'reply-comment',
      ({ id, targetUserId, targetUserName }) => {
        this.handleSubCommentReply({ id, targetUserId, targetUserName })
      }
    )
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
    async lazyLoadComment() {
      if (!this.lazy) {
        this.$nextTick(() => {
          this.scrollToReply()
        })
        return
      }
      const { query } = this.$route
      await this.$store.dispatch('comment/getMainComments', {
        id: this.id,
        type: this.type,
        seeReplyId: query['comment-id'],
        onlySeeMaster: query.only ? (parseInt(query.only, 10) ? 1 : 0) : 0
      })
      this.$nextTick(() => {
        this.scrollToReply()
      })
    },
    autoLoadMoreMainComment() {
      this.loadMoreMainComment(false)
    },
    async loadMoreMainComment(firstRequest = false) {
      if (this.loadingMainComment) {
        return
      }
      this.loadingMainComment = true
      try {
        await this.$store.dispatch('comment/getMainComments', {
          ctx: this,
          type: this.type,
          id: this.id,
          onlySeeMaster: this.onlySeeMaster ? 1 : 0,
          firstRequest
        })
      } finally {
        this.loadingMainComment = false
      }
    },
    async loadMoreSubComment() {
      if (this.loadingSubComment) {
        return
      }
      this.loadingSubComment = true
      try {
        await this.$store.dispatch('comment/getSubComments', {
          ctx: this,
          type: this.type,
          id: this.focusCommentId
        })
      } finally {
        this.loadingSubComment = false
      }
    },
    commentToComment(data) {
      this.handleSubCommentReply({
        id: data.parent_id,
        targetUserId: data.from_user_id,
        targetUserName: data.from_user_name
      })
    },
    handleCommentBtnClick() {
      this.handleSubCommentReply({
        id: this.focusComment.id,
        targetUserId: this.focusComment.from_user_id,
        targetUserName: this.focusComment.from_user_name
      })
    },
    handleSubCommentReply({ id, targetUserId, targetUserName }) {
      if (!this.currentUserId) {
        this.$channel.$emit('sign-in')
        return
      }
      this.replyForm.id = id
      this.replyForm.targetUserId = targetUserId
      this.replyForm.targetUserName = targetUserName
      this.replyForm.open = true
      setTimeout(() => {
        document.body.scrollTop = 0
      }, 200)
    },
    async toggleFocusCommentLike() {
      if (!this.currentUserId) {
        this.$channel.$emit('sign-in')
        return
      }
      if (this.replyForm.liking) {
        return
      }
      this.replyForm.liking = true
      try {
        await this.$store.dispatch('comment/toggleLikeMainComment', {
          ctx: this,
          type: this.type,
          id: this.focusCommentId
        })
      } finally {
        this.replyForm.liking = false
      }
    },
    async handleReplySubmit() {
      if (!this.currentUserId) {
        this.$channel.$emit('sign-in')
        return
      }
      if (!this.replyForm.content) {
        return
      }
      if (this.replyForm.replying) {
        return
      }
      this.replyForm.replying = true
      try {
        const result = await this.$store.dispatch('comment/createSubComment', {
          ctx: this,
          id: this.replyForm.id,
          type: this.type,
          content: this.replyForm.content,
          targetUserId: this.replyForm.targetUserId
        })
        this.replyForm.open = false
        this.replyForm.content = ''
        this.$toast.success(result.message)
        this.$store.commit('UPDATE_USER_EXP', result.exp)
      } finally {
        this.replyForm.replying = false
      }
    },
    writeComment() {
      this.$channel.$emit(`open-create-comment-drawer-${this.type}-${this.id}`)
    },
    closeCommentDrawer() {
      this.openCreateCommentDrawer = false
    },
    submitCommentCallback() {
      this.openCreateCommentDrawer = false
      this.$emit('create-main-comment')
    },
    deleteCommentCallback() {
      this.$emit('delete-main-comment')
    },
    scrollToReply() {
      const replyId = this.$route.query['comment-id']
      if (!replyId) {
        return
      }
      const reply = document.getElementById(`comment-${replyId}`)
      if (!reply) {
        return
      }
      setTimeout(() => {
        scrollToY(this.$utils.getOffsetTop(reply) - 100, 600)
      }, 400)
    }
  }
}
</script>
