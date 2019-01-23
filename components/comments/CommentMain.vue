<style lang="scss">
#comment-wrap {
  .sub-title {
    margin-top: 15px;
    margin-bottom: 15px;

    .write-btn {
      float: right;
      font-weight: bold;
      font-size: 13px;
    }
  }

  #comment-list-footer {
    margin-left: -$container-padding;
    margin-right: -$container-padding;
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
    #reply-comment-textarea {
      position: fixed;
      left: 0;
      top: 60px;
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
      display: none;
      opacity: 0;

      &.fade-in {
        opacity: 1;
        transition-delay: 400ms;
      }
    }
  }

  .append-comment-btn {
    width: 100%;
    padding: 15px 0;
    font-size: 13px;
  }

  .no-content {
    text-align: center;
    margin-top: 30px;
    margin-bottom: 30px;
    font-size: 12px;
    color: #99a2aa;
  }
}
</style>

<template>
  <div id="comment-wrap">
    <!-- 主列表的头部 -->
    <slot name="header">
      <div 
        v-if="!auto" 
        class="hr" />
      <h3 class="sub-title">
        评论{{ total ? `(${total})` : '' }} <slot name="header-btn" />
        <button 
          class="write-btn" 
          @click="writeComment">写评论</button>
      </h3>
    </slot>
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
            <comment-item
              :type="type"
              :comment="comment"
              :master-id="masterId"
              @delete="deleteCommentCallback"
            />
          </slot>
        </div>
      </div>
      <div id="comment-list-footer">
        <button
          v-if="bottomAppendComment"
          class="append-comment-btn"
          @click="writeComment"
        >
          写评论
        </button>
        <more-btn
          :no-more="noMore"
          :loading="loadingMainComment"
          :auto="true"
          @fetch="loadMoreMainComment(false)"
        />
      </div>
    </template>
    <p 
      v-else-if="emptyText" 
      class="no-content" 
      v-text="emptyText" />
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
              <a
                :href="$alias.user(focusComment.from_user_zone)"
                class="avatar"
              >
                <v-img
                  :src="focusComment.from_user_avatar"
                  :avatar="true"
                  width="35"
                />
              </a>
              <div class="summary">
                <a
                  :href="$alias.user(focusComment.from_user_zone)"
                  class="nickname"
                  v-text="focusComment.from_user_name"
                />
                <div class="info">
                  <v-time v-model="focusComment.created_at" />
                </div>
              </div>
            </div>
            <div class="content">
              <div 
                class="text-area" 
                v-html="focusComment.content" />
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
                    :full="true"
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
                {{ focusComment.liked ? '已赞' : '赞' }}
                <span 
                  v-if="focusComment.like_count"
                >({{ focusComment.like_count }})</span
                >
              </button>
              <button 
                class="reply-btn fr" 
                @click="handleCommentBtnClick">
                回复
              </button>
            </div>
          </div>
          <div class="hr" />
          <p class="total">{{ focusComment.comments.total }}条回复</p>
          <ul class="comments">
            <li 
              v-for="item in focusComment.comments.list" 
              :key="item.id">
              <div class="from-user">
                <a 
                  :href="$alias.user(item.from_user_zone)" 
                  class="avatar">
                  <v-img
                    :src="item.from_user_avatar"
                    :avatar="true"
                    width="35"
                  />
                </a>
                <div class="summary">
                  <div class="users oneline">
                    <a
                      :href="$alias.user(item.from_user_zone)"
                      class="nickname"
                      v-text="item.from_user_name"
                    />
                    <template v-if="item.to_user_zone">
                      回复
                      <a
                        :href="$alias.user(item.to_user_zone)"
                        class="nickname"
                        v-text="item.to_user_name"
                      />
                    </template>
                    :
                  </div>
                  <div class="info"><v-time v-model="item.created_at" /></div>
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
        <more-btn
          :no-more="focusComment.comments.noMore"
          :loading="loadingSubComment"
          @fetch="loadMoreSubComment"
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
        class="reply-comment-drawer"
        from="right"
        size="100%"
        submit-text="发布"
        @cancel="handleReplyDrawerClose"
        @submit="handleReplySubmit"
      />
      <textarea
        id="reply-comment-textarea"
        :class="{ 'fade-in': replyForm.open }"
        v-model.trim="replyForm.content"
        placeholder="100字以内任意发挥"
        maxlength="100"
      />
    </div>
    <!-- comment drawer -->
    <v-drawer
      v-model="openCreateCommentDrawer"
      from="right"
      size="100%"
      header-text="发表评论"
    >
      <div 
        v-if="openCreateCommentDrawer" 
        class="container">
        <slot 
          :close="closeCommentDrawer" 
          name="reply-form">
          <comment-create-form
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

export default {
  name: 'VCommentMain',
  components: {
    CommentCreateForm,
    CommentItem
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
    emptyText: {
      type: String,
      default: '暂无评论，快来抢沙发吧╮(￣▽￣)╭！'
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
      openCreateCommentDrawer: false
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
    document.getElementById('comment-wrap').addEventListener('click', e => {
      if (/reply-btn/.test(e.target.className) && this.$el.contains(e.target)) {
        const area = document.getElementById('reply-comment-textarea')
        area.style.display = 'block'
        area.focus()
      }
    })
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
    handleReplyDrawerClose() {
      document.getElementById('reply-comment-textarea').style.display = 'none'
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
        this.handleReplyDrawerClose()
      }
    },
    writeComment() {
      this.$channel.$emit(`open-create-comment-drawer-${this.type}-${this.id}`)
    },
    closeCommentDrawer() {
      console.log('')
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
