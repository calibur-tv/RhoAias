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
            @include avatar-2(35px)
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
              @include avatar-2(35px);
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
      <div class="hr"></div>
      <h3 class="sub-title">
        评论{{ total ? `(${total})` : '' }}
        <button class="write-btn" @click="writeComment">写评论</button>
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
          <slot name="comment-item" :comment="comment" :reply="handleSubCommentReply">
            <comment-item
              :type="type"
              :comment="comment"
              :master-id="masterId"
            ></comment-item>
          </slot>
        </div>
      </div>
      <div id="comment-list-footer">
        <button
          v-if="bottomAppendComment"
          @click="writeComment"
          class="append-comment-btn"
        >写评论</button>
        <more-btn
          :no-more="noMore"
          :loading="loadingMainComment"
          @fetch="loadMoreMainComment"
        ></more-btn>
      </div>
    </template>
    <p class="no-content" v-else-if="emptyText" v-text="emptyText"></p>
    <!-- reply detail drawer -->
    <v-drawer
      v-model="openFocusCommentDrawer"
      from="bottom"
      size="100%"
      class="focus-comment-drawer"
      :header-text="`评论列表${focusComment && focusComment.floor_count ? ` - ${focusComment.floor_count} 楼` : ''}`"
      :backdrop="false"
    >
      <template v-if="focusComment">
        <div class="container">
          <div class="reply">
            <div class="user clearfix">
              <a class="avatar" :href="$alias.user(focusComment.from_user_zone)">
                <img :src="$resize(focusComment.from_user_avatar, { width: 70 })">
              </a>
              <div class="summary">
                <a
                  class="nickname"
                  :href="$alias.user(focusComment.from_user_zone)"
                  v-text="focusComment.from_user_name"
                ></a>
                <div class="info">
                  <v-time v-model="focusComment.created_at"></v-time>
                </div>
              </div>
            </div>
            <div class="content">
              <div class="text-area" v-html="focusComment.content"></div>
              <div class="image-area">
                <div
                  class="image-package"
                  v-for="(img, idx) in focusComment.images"
                  :key="idx"
                  @click="$previewImages(focusComment.images, idx)"
                >
                  <v-img
                    class="image"
                    :src="img.url"
                    width="150"
                    mode="2"
                  ></v-img>
                </div>
              </div>
            </div>
            <div class="social">
              <button
                :class="[ focusComment.liked ? 'reply-liked-btn' : 'reply-like-btn' ]"
                @click="toggleFocusCommentLike"
              >
                <i class="iconfont icon-icon_good"></i>
                {{ focusComment.liked ? '已赞' : '赞' }}
                <span v-if="focusComment.like_count">({{ focusComment.like_count }})</span>
              </button>
              <button class="reply-btn fr" @click="handleCommentBtnClick">
                回复
              </button>
            </div>
          </div>
          <div class="hr"></div>
          <p class="total">{{ focusComment.comments.total }}条回复</p>
          <ul class="comments">
            <li
              v-for="item in focusComment.comments.list"
              :key="item.id"
            >
              <div class="from-user">
                <a
                  class="avatar"
                  :href="$alias.user(item.from_user_zone)"
                >
                  <img :src="$resize(item.from_user_avatar, { width: 70 })"/>
                </a>
                <div class="summary">
                  <div class="users oneline">
                    <a
                      class="nickname"
                      :href="$alias.user(item.from_user_zone)"
                      v-text="item.from_user_name"
                    ></a>
                    <template v-if="item.to_user_zone">
                      回复
                      <a
                        class="nickname"
                        :href="$alias.user(item.to_user_zone)"
                        v-text="item.to_user_name"
                      ></a>
                    </template>
                    :
                  </div>
                  <div class="info">
                    <v-time v-model="item.created_at"></v-time>
                  </div>
                </div>
              </div>
              <div class="main">
                <div class="content reply-btn" @click="commentToComment(item)" v-text="item.content"></div>
              </div>
            </li>
          </ul>
        </div>
        <more-btn
          :no-more="focusComment.comments.noMore"
          :loading="loadingSubComment"
          @fetch="loadMoreSubComment"
        ></more-btn>
      </template>
    </v-drawer>
    <!-- reply drawer -->
    <div class="reply-comment-drawer-wrap">
      <v-drawer
        class="reply-comment-drawer"
        from="right"
        size="100%"
        v-model="replyForm.open"
        :header-text="currentUserId === replyForm.targetUserId ? '回复' : `回复：${replyForm.targetUserName}`"
        :backdrop="false"
        submitText="发布"
        @cancel="handleReplyDrawerClose"
        @submit="handleReplySubmit"
      >
      </v-drawer>
      <textarea
        id="reply-comment-textarea"
        :class="{ 'fade-in': replyForm.open }"
        placeholder="100字以内任意发挥"
        maxlength="100"
        v-model.trim="replyForm.content"
      ></textarea>
    </div>
    <!-- comment drawer -->
    <v-drawer
      v-model="openCreateCommentDrawer"
      from="right"
      size="100%"
      header-text="发表评论"
    >
      <div class="container" v-if="openCreateCommentDrawer">
        <slot name="reply-form" :close="closeCommentDrawer">
          <comment-create-form
            v-if="openCreateCommentDrawer"
            :id="id"
            :type="type"
            @close="closeCommentDrawer"
          ></comment-create-form>
        </slot>
      </div>
    </v-drawer>
  </div>
</template>

<script>
  import CommentCreateForm from './CommentCreateForm'
  import CommentItem from './CommentItem'

  export default {
    name: 'v-comment-main',
    props: {
      id: {
        required: true,
        type: [Number, String]
      },
      type: {
        required: true,
        type: String,
        validator: val => ~['post', 'video', 'image', 'score'].indexOf(val)
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
      }
    },
    components: {
      CommentCreateForm,
      CommentItem
    },
    computed: {
      store () {
        return this.$store.state.comment
      },
      list () {
        return this.store.list
      },
      noMore () {
        return this.store.noMore
      },
      total () {
        return this.store.total
      },
      focusComment () {
        return this.focusCommentId
          ? this.list.filter(_ => _.id === this.focusCommentId)[0]
          : null
      },
      currentUserId () {
        return this.$store.state.login
          ? this.$store.state.user.id
          : 0
      }
    },
    data () {
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
    methods: {
      async loadMoreMainComment () {
        if (this.loadingMainComment) {
          return
        }
        this.loadingMainComment = true
        try {
          await this.$store.dispatch('comment/getMainComments', {
            ctx: this,
            type: this.type,
            id: this.id,
            onlySeeMaster: this.onlySeeMaster ? 1 : 0
          })
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.loadingMainComment = false
        }
      },
      async loadMoreSubComment () {
        if (this.loadingSubComment) {
          return
        }
        this.loadingSubComment = true
        try {
          await this.$store.dispatch('comment/getSubComments', {
            ctx: this,
            type: this.type,
            parentId: this.focusCommentId
          })
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.loadingSubComment = false
        }
      },
      commentToComment (data) {
        this.handleSubCommentReply({
          id: data.parent_id,
          targetUserId: data.from_user_id,
          targetUserName: data.from_user_name
        })
      },
      handleCommentBtnClick () {
        this.handleSubCommentReply({
          id: this.focusComment.parent_id,
          targetUserId: this.focusComment.from_user_id,
          targetUserName: this.focusComment.from_user_name
        })
      },
      handleSubCommentReply ({ id, targetUserId, targetUserName }) {
        if (!this.currentUserId) {
          this.$channel.$emit('sign-in')
          return
        }
        this.replyForm.id = id
        this.replyForm.targetUserId = targetUserId
        this.replyForm.targetUserName = targetUserName
        this.replyForm.open = true
        setTimeout(() => { document.body.scrollTop = 0 }, 200)
      },
      async toggleFocusCommentLike () {
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
        } catch (e) {
        } finally {
          this.replyForm.liking = false
        }
      },
      handleReplyDrawerClose () {
        document.getElementById('reply-comment-textarea').style.display = 'none'
      },
      async handleReplySubmit () {
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
        this.$toast.loading('提交中...')
        try {
          await this.$store.dispatch('comment/createSubComment', {
            ctx: this,
            id: this.replyForm.id,
            type: this.type,
            content: this.replyForm.content,
            targetUserId: this.replyForm.targetUserId
          })
          this.replyForm.open = false
          this.replyForm.content = ''
          this.$toast.success('回复成功')
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.replyForm.replying = false
          this.handleReplyDrawerClose()
        }
      },
      writeComment () {
        this.$channel.$emit('open-create-comment-drawer')
      },
      closeCommentDrawer () {
        this.openCreateCommentDrawer = false
      }
    },
    mounted () {
      this.$channel.$on('load-all-sub-comment', ({ id }) => {
        this.focusCommentId = id
        this.openFocusCommentDrawer = true
      })
      this.$channel.$on('open-create-comment-drawer', () => {
        if (!this.currentUserId) {
          this.$channel.$emit('sign-in')
          return
        }
        this.openCreateCommentDrawer = true
      })
      this.$channel.$on('reply-comment', ({ id, targetUserId, targetUserName }) => {
        this.handleSubCommentReply({ id, targetUserId, targetUserName })
      })
      document.getElementById('comment-wrap').addEventListener('click', (e) => {
        if (/reply-btn/.test(e.target.className)) {
          const area = document.getElementById('reply-comment-textarea')
          area.style.display = 'block'
          area.focus()
        }
      })
    }
  }
</script>
