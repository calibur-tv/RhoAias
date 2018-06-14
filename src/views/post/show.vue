<style lang="scss">
  #post-show {
    .post {
      .title {
        color: #000;
        font-size: 18px;
        font-weight: 700;
        line-height: 28px;
        margin: 8px 0 15px;
      }

      .user {
        position: relative;
        .avatar {
          float: left;
          margin-right: 9px;
          @include avatar(35px)
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
        margin: 22px 0;
        line-height: 24px;

        .image-area {
          margin: 16px 0;

          img {
            width: 100%;
            height: auto;
          }
        }
      }

      .footer {
        text-align: center;
        margin-bottom: 30px;

        button {
          margin: 0 5px;
          font-size: 13px;

          i {
            font-size: 12px;
            line-height: 16px;
          }
        }

        .post-like-btn {
          @include btn-empty(#ffffff, #fa5555);
        }

        .post-liked-btn {
          @include btn-empty(#fa5555);
        }

        .post-mark-btn {
          @include btn-empty(#ffffff, #eb9e05);
        }

        .post-marked-btn {
          @include btn-empty(#eb9e05);
        }

        .post-comment-btn {
          @include btn-empty(#ffffff, $color-blue-normal);
        }
      }
    }

    .post-comment-drawer {
      .reply {
        .user {
          padding-top: $container-padding;

          .avatar {
            float: left;
            margin-right: 9px;
            @include avatar(35px)
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
          padding-bottom: 16px;
          color: #000;

          .image-area {
            margin: 16px 0;

            img {
              width: 100%;
              height: auto;
            }
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
              @include avatar(35px);
            }

            .summary {
              overflow: hidden;

              .nickname {
                display: inline-block;
                font-size: 14px;
                line-height: 14px;
                margin-bottom: 6px;
                margin-top: 2px;
                color: $color-blue-deep;
              }

              .info {
                font-size: 12px;
                line-height: 12px;
                color: #999;
              }
            }
          }

          .content {
            padding-top: 11px;
            font-size: 16px;
            line-height: 24px;
            margin-left: 45px;

            a {
              font-size: 16px;
            }
          }
        }
      }
    }

    .create-post-comment-drawer {
      border-radius: 0 0 5px 5px;

      .container {
        display: flex;
        flex-direction: column;
        height: 100%;
        margin-top: -46px;
        padding-top: 46px;
        z-index: -1;
      }

      textarea {
        font-size: 16px;
        line-height: 24px;
        color: #000;
        font-weight: 400;
        padding-top: 10px;
        flex-grow: 1;
      }

      .btn-submit {
        margin-top: $container-padding;
        margin-bottom: $container-padding;
      }
    }

    .bangumi-panel {
      padding-top: $container-padding;
      padding-bottom: $container-padding;

      .summary {
        font-size: 12px;
        color: #666;
        @include twoline(13px)
      }
    }
  }
</style>

<template>
  <div id="post-show">
    <div class="container">
      <div class="post">
        <h1 class="title" v-text="post.title"></h1>
        <div class="user">
          <a class="avatar" :href="$alias.user(master.zone)">
            <img :src="$resize(master.avatar, { width: 70 })">
          </a>
          <button class="tool-btn" @click="showPostActionSheet = true">···</button>
          <div class="summary">
            <a
              class="nickname"
              :href="$alias.user(master.zone)"
              v-text="master.nickname"
            ></a>
            <div class="info">
              <span>第1楼</span>
              <span>·</span>
              <template v-if="total > 1">
                <span>共{{ total }}楼</span>
                <span>·</span>
              </template>
              <v-time v-model="post.created_at"></v-time>
              <span class="fr" v-if="post.view_count">
                <i class="iconfont icon-yuedu"></i>
                {{ $utils.shortenNumber(post.view_count) }}
              </span>
            </div>
          </div>
        </div>
        <div class="content">
          <div class="text-area" v-html="post.content"></div>
          <div class="image-area">
            <div
              class="image-package"
              v-for="(img, idx) in post.images"
              :key="idx"
              @click="$previewImages(post.preview_images, img)"
            >
              <v-img
                :src="img.url"
                width="150"
                mode="2"
                :aspect="$computeImageAspect(img)"
              ></v-img>
            </div>
          </div>
        </div>
        <div class="footer">
          <button
            :class="[ post.liked ? 'post-liked-btn' : 'post-like-btn' ]"
            @click="toggleLike"
          >
            <i class="iconfont icon-guanzhu"></i>
            {{ post.liked ? '已喜欢' : '喜欢' }}{{ post.like_count ? `(${post.like_count})` : '' }}
          </button>
          <button
            :class="[ post.marked ? 'post-marked-btn' : 'post-mark-btn' ]"
            @click="toggleMark"
          >
            <i class="iconfont icon-shoucang"></i>
            {{ post.marked ? '已收藏' : '收藏' }}{{ post.mark_count ? `(${post.mark_count})` : '' }}
          </button>
          <button
            class="post-comment-btn"
            @click="handleReplyBtnClick"
          >
            <i class="iconfont icon-pinglun1"></i>
            回复
          </button>
        </div>
        <mt-actionsheet
          :actions="actions"
          v-model="showPostActionSheet"
        ></mt-actionsheet>
      </div>
      <div class="hr"></div>
      <comment-main
        type="post"
        :id="post.id"
        :only-see-master="onlySeeMaster"
      >
        <post-comment-item
          slot="comment-item"
          slot-scope="{ comment, reply }"
          :post="comment"
          :master-id="master.id"
          @reply="reply"
        ></post-comment-item>
      </comment-main>
    </div>
    <div class="hr"></div>
    <div class="container bangumi-panel">
      <h3 class="sub-title">所属番剧：</h3>
      <v-bangumi-panel
        :id="bangumi.id"
        :avatar="bangumi.avatar"
        :name="bangumi.name"
        :followed="bangumi.followed"
        @follow="handleBangumiFollow"
      >
        <p class="summary" v-text="bangumi.summary"></p>
      </v-bangumi-panel>
    </div>
    <v-drawer
      v-model="createComment.open"
      from="top"
      size="250px"
      header-text="发布回复"
      class="create-post-comment-drawer"
    >
      <div class="container">
        <textarea
          :placeholder="createComment.to_user_name ? `回复：${createComment.to_user_name}（50字以内任你发挥）` : '50字以内任你发挥'"
          v-model.trim="createComment.content"
          maxlength="50"
        ></textarea>
        <button
          class="btn-submit"
          @click="submitComment"
        >发布</button>
      </div>
    </v-drawer>
  </div>
</template>

<script>
  import CommentMain from '~/components/comments/CommentMain'
  import PostCommentItem from '~/components/post/PostCommentItem'

  export default {
    name: 'post-show',
    async asyncData ({ route, store, ctx }) {
      const only = route.query.only
        ? parseInt(route.query.only, 10) ? 1 : 0
        : 0
      const id = route.params.id
      await Promise.all([
        store.dispatch('post/getPost', {
          id,
          ctx,
          only
        }),
        store.dispatch('comment/getMainComments', {
          ctx,
          id,
          type: 'post',
          onlySeeMaster: only,
          seeReplyId: route.query.reply
        })
      ])
    },
    components: {
      CommentMain,
      PostCommentItem
    },
    head () {
      return {
        title: `${this.post.title} - 帖子`
      }
    },
    computed: {
      resource () {
        return this.$store.state.post.show
      },
      bangumi () {
        return this.resource.info.bangumi
      },
      post () {
        return this.resource.info.post
      },
      master () {
        return this.resource.info.user
      },
      total () {
        return this.$store.state.comment.total + 1
      },
      masterId () {
        return this.master.id
      },
      onlySeeMaster () {
        return !!parseInt(this.$route.query.only, 10)
      },
      isMaster () {
        if (!this.$store.state.login) {
          return false
        }
        const currentUserId = this.$store.state.user.id
        return currentUserId === this.masterId
      },
      focusComments () {
        if (!this.openCommentId) {
          return []
        }
        return this.list[this.openCommentIndex].comments
      },
      focusReply () {
        if (!this.openCommentId) {
          return null
        }
        return this.list[this.openCommentIndex]
      },
      noMoreComment () {
        return this.openCommentId
          ? this.focusComments.length >= this.focusReply.comment_count
          : true
      },
      actions () {
        const result = [{
          name: '回复',
          method: this.handleReplyBtnClick
        }]
        if (this.isMaster) {
          result.push({
            name: '删除',
            method: this.deletePost
          })
        } else {
          result.push({
            name: this.post.liked ? '取消喜欢' : '喜欢',
            method: this.toggleLike
          })
          result.push({
            name: this.post.marked ? '取消收藏' : '收藏',
            method: this.toggleMark
          })
        }
        result.push({
          name: this.onlySeeMaster ? '取消只看楼主' : '只看楼主',
          method: this.switchOnlyMaster
        })

        return result
      }
    },
    data () {
      return {
        loadingLoadMore: false,
        loadingToggleLike: false,
        loadingToggleMark: false,
        openCommentIndex: 0,
        openCommentId: 0,
        openCommentsDrawer: false,
        loadingComments: false,
        openReplyDrawer: false,
        createComment: {
          open: false,
          content: '',
          postId: 0,
          targetUserId: 0,
          loading: false,
          to_user_name: ''
        },
        showPostActionSheet: false
      }
    },
    methods: {
      handleBangumiFollow (result) {
        this.$store.commit('post/followBangumi', {
          id: this.post.id,
          result
        })
      },
      switchOnlyMaster () {
        window.location = this.$alias.post(this.post.id, {
          only: this.onlySeeMaster ? 0 : 1
        })
      },
      deletePost () {
        this.$confirm('删除后无法找回, 是否继续?').then(async () => {
          await this.$store.dispatch('post/deletePost', {
            ctx: this,
            id: this.post.id
          })
          window.location = this.$alias.bangumi(this.bangumi.id)
        }).catch((e) => {
          this.$toast.error(e)
        })
      },
      deletePostComment (id) {
        this.$confirm('删除后无法找回, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.$store.dispatch('post/deletePostComment', {
            ctx: this,
            postId: this.post.id,
            commentId: id
          })
          this.$toast.success('删除成功')
        }).catch((e) => {
          this.$toast.error(e)
        })
      },
      async getPosts (reset) {
        this.loadingLoadMore = true
        try {
          await this.$store.dispatch('post/getPost', {
            id: this.post.id,
            ctx: this,
            only: this.onlySeeMaster ? 1 : 0,
            reset
          })
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.loadingLoadMore = false
        }
      },
      async toggleLike () {
        if (!this.$store.state.login) {
          this.$channel.$emit('sign-in')
          return
        }
        if (this.isMaster) {
          this.$toast.error('不能赞赏自己的帖子')
          return
        }
        const notLike = !this.post.liked
        if (notLike && !this.$store.state.user.coin) {
          this.$toast.error('金币不足')
          return
        }
        if (this.loadingToggleLike) {
          return
        }
        this.loadingToggleLike = true
        try {
          await this.$store.dispatch('post/toggleLike', {
            ctx: this,
            id: this.post.id
          })
          if (notLike) {
            this.$store.commit('USE_COIN')
          }
        } catch (err) {
          this.$toast.error(err)
        } finally {
          this.loadingToggleLike = false
        }
      },
      async toggleMark () {
        if (!this.$store.state.login) {
          this.$channel.$emit('sign-in')
          return
        }
        if (this.isMaster) {
          this.$toast.error('不能收藏自己的帖子')
          return
        }
        if (this.loadingToggleMark) {
          return
        }
        this.loadingToggleMark = true
        try {
          await this.$store.dispatch('post/toggleMark', {
            ctx: this,
            id: this.post.id
          })
        } catch (err) {
          this.$toast.error(err)
        } finally {
          this.loadingToggleMark = false
        }
      },
      handleCommentLoad (data) {
        this.openCommentIndex = data.index
        this.openCommentId = data.id
        this.openCommentsDrawer = true
      },
      async loadMoreComment () {
        if (this.loadingComments) {
          return
        }
        this.loadingComments = true
        try {
          await this.$store.dispatch('post/getComments', {
            id: this.openCommentId
          })
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.loadingComments = false
        }
      },
      handleReplyBtnClick () {
        this.$channel.$emit('open-create-comment-drawer')
      },
      handleCommentAdd (data) {
        if (!this.$store.state.login) {
          this.$channel.$emit('sign-in')
          return
        }
        this.createComment.id = data.postId
        this.createComment.targetUserId = data.targetUserId
        this.createComment.to_user_name = ''
        this.createComment.open = true
      },
      async submitComment () {
        if (!this.createComment.content) {
          this.$toast.error('内容不能为空')
          return
        }
        if (this.createComment.loading) {
          return
        }
        this.createComment.loading = true
        this.$toast.loading('发布中...')
        try {
          await this.$store.dispatch('post/setComment', Object.assign(this.createComment, {
            ctx: this
          }))
          this.$toast.success('回复成功')
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.createComment.open = false
          this.createComment.content = ''
          this.createComment.to_user_name = ''
          this.createComment.loading = false
        }
      },
      handleSelectSubmit (option) {
        if (option === '只看楼主' || option === '取消只看楼主') {
          this.switchOnlyMaster()
        } else if (option === '删除') {
          this.deletePost()
        } else if (option === '喜欢' || option === '取消喜欢') {
          this.toggleLike()
        } else if (option === '收藏' || option === '取消收藏') {
          this.toggleMark()
        } else if (option === '回复') {
          this.handleReplyBtnClick()
        }
      },
      commentToComment (comment) {
        if (!this.$store.state.login) {
          return
        }
        this.createComment.id = this.focusReply.id
        this.createComment.targetUserId = comment.from_user_id
        this.createComment.to_user_name = comment.from_user_name
        this.createComment.open = true
      },
      handlePostReply (data) {
        this.createComment.id = data.postId
        this.createComment.targetUserId = data.targetUserId
        this.createComment.to_user_name = data.to_user_name
        this.createComment.open = true
      },
      scrollToReply () {
        const replyId = this.$route.query.reply
        if (!replyId) {
          return
        }
        const reply = document.getElementById(`post-reply-${replyId}`)
        if (!reply) {
          return
        }
        this.$nextTick(() => {
          this.$scrollToY(reply.offsetTop, 400)
        })
      }
    },
    mounted () {
      this.scrollToReply()
    }
  }
</script>
