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

        .selector {
          position: absolute;
          right: 5px;
          top: 0;
          width: 102px;
          line-height: 16px;
          font-size: 12px;
          color: #535353;
          z-index: 5;

          .v-select-options-wrap {
            background-color: #fff;
            border: 1px solid #f0f0f0;
            box-shadow: 0 2px 3px #ccc;
            border-radius: 4px;
            top: 18px;
          }

          .v-select-options-item {
            height: 36px;
            line-height: 35px;
            color: #535353;
            font-size: 12px;
            padding-left: 15px;

            &:not(:last-child) {
              border-bottom: 1px solid #f0f0f0;
            }
          }
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
          <router-link class="avatar" :to="$alias.user(master.zone)">
            <img :src="$resize(master.avatar, { width: 70 })">
          </router-link>
          <v-select
            class="selector"
            placeholder=""
            :abort="true"
            :options="options"
            @submit="handleSelectSubmit"
          >
            <template slot="tail">···</template>
          </v-select>
          <div class="summary">
            <router-link
              class="nickname"
              :to="$alias.user(master.zone)"
              v-text="master.nickname"
            ></router-link>
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
              :key="img"
              @click="$previewImages(post.images, img)"
            >
              <v-img
                :src="img"
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
      </div>
      <div class="hr"></div>
      <post-reply
        v-for="(item, index) in list"
        :key="item.id"
        :post="item"
        :index="index"
        :preview="post.previewImages"
        @delete="deletePost(item.id)"
        @reply="handlePostReply"
        @loadcomment="handleCommentLoad"
        @addcomment="handleCommentAdd"
      ></post-reply>
    </div>
    <more-btn
      :no-more="noMore"
      :loading="loadingLoadMore"
      @fetch="getPosts(false)"
    ></more-btn>
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
      v-model="openCommentsDrawer"
      from="bottom"
      size="100%"
      class="post-comment-drawer"
      :header-text="`评论列表 - ${focusReply ? focusReply.floor_count : ''}楼`"
      :backdrop="false"
    >
      <div
        class="container"
      >
        <template v-if="focusReply">
          <div class="reply">
            <div class="user clearfix">
              <router-link class="avatar" :to="$alias.user(focusReply.user.zone)">
                <img :src="$resize(focusReply.user.avatar, { width: 70 })">
              </router-link>
              <div class="summary">
                <router-link
                  class="nickname"
                  :to="$alias.user(focusReply.user.zone)"
                  v-text="focusReply.user.nickname"
                ></router-link>
                <div class="info">
                  <v-time v-model="post.created_at"></v-time>
                </div>
              </div>
            </div>
            <div class="content">
              <div class="text-area" v-html="focusReply.content"></div>
              <div class="image-area">
                <div
                  class="image-package"
                  v-for="(img, idx) in focusReply.images"
                  :key="img"
                  @click="$previewImages(focusReply.images, idx)"
                >
                  <v-img class="image" :src="img" width="150" mode="2"></v-img>
                </div>
              </div>
            </div>
          </div>
          <div class="hr"></div>
          <p class="total">{{ focusReply.comment_count }}条回复</p>
        </template>
        <ul
          class="comments"
          v-infinite-scroll="loadMoreComment"
          infinite-scroll-disabled="notFetchComment"
          infinite-scroll-distance="50"
        >
          <li
            v-for="item in focusComments"
          >
            <div class="from-user">
              <router-link
                class="avatar"
                :to="$alias.user(item.from_user_zone)"
              >
                <img :src="$resize(item.from_user_avatar, { width: 70 })"/>
              </router-link>
              <div class="summary">
                <router-link
                  class="nickname"
                  :to="$alias.user(item.from_user_zone)"
                  v-text="item.from_user_name"
                ></router-link>
                <div class="info">
                  <v-time v-model="item.created_at"></v-time>
                </div>
              </div>
            </div>
            <div class="content" @click="commentToComment(item)">
              <template v-if="item.to_user_zone">
                回复
                <router-link
                  class="nickname"
                  :to="$alias.user(item.to_user_zone)"
                  v-text="item.to_user_name"
                ></router-link>
                :
              </template>
              <span class="comment-content">{{ item.content }}</span>
            </div>
          </li>
        </ul>
      </div>
      <more-btn
        :no-more="notFetchComment"
        :loading="loadingComments"
        :auto="true"
      ></more-btn>
    </v-drawer>
    <v-drawer
      v-model="createComment.open"
      from="top"
      size="40%"
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
  import PostReply from '~/components/post/Reply'

  export default {
    name: 'post-show',
    async asyncData ({ route, store, ctx }) {
      await store.dispatch('post/getPost', {
        id: route.params.id,
        ctx,
        only: route.query.only
          ? parseInt(route.query.only, 10) ? 1 : 0
          : 0,
        reset: true,
        reply: route.query.reply
      })
    },
    components: {
      PostReply
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
      list () {
        return this.$utils.orderBy(this.resource.data.list, 'floor_count')
      },
      total () {
        return this.resource.data.total
      },
      noMore () {
        return this.resource.data.noMore
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
      notFetchComment () {
        return this.openCommentId
          ? this.focusComments.length >= this.focusReply.comment_count
          : true
      },
      options () {
        const result = ['回复']
        if (this.isMaster) {
          result.push('删除')
        } else {
          result.push(this.post.liked ? '取消喜欢' : '喜欢')
          result.push(this.post.marked ? '取消收藏' : '收藏')
        }
        result.push(this.onlySeeMaster ? '取消只看楼主' : '只看楼主')

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
        }
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
      deletePost (id) {
        this.$confirm('删除后无法找回, 是否继续?').then(async () => {
          await this.$store.dispatch('post/deletePost', {
            ctx: this,
            id
          })
          if (id === this.post.id) {
            window.location = this.$alias.bangumi(this.bangumi.id)
          }
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
            only: this.onlySeeMaster,
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
          this.$channel.$emit('drawer-open-sign')
          return
        }
        if (this.isMaster) {
          this.$toast.warn('不能赞赏自己的帖子')
          return
        }
        const notLike = !this.post.liked
        if (notLike && !this.$store.state.user.coin) {
          this.$toast.warn('金币不足')
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
          this.$channel.$emit('drawer-open-sign')
          return
        }
        if (this.isMaster) {
          this.$toast.warn('不能收藏自己的帖子')
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
            postId: this.openCommentId
          })
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.loadingComments = false
        }
      },
      handleReplyBtnClick () {
        this.$store.state.login
          ? this.$channel.$emit('drawer-open-write-post')
          : this.$channel.$emit('drawer-open-sign')
      },
      handleCommentAdd (data) {
        if (!this.$store.state.login) {
          this.$channel.$emit('drawer-open-sign')
          return
        }
        this.createComment.postId = data.postId
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
          this.deletePost(this.post.id)
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
        this.createComment.postId = this.focusReply.id
        this.createComment.targetUserId = comment.from_user_id
        this.createComment.to_user_name = comment.from_user_name
        this.createComment.open = true
      },
      handlePostReply (data) {
        this.createComment.postId = data.postId
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
