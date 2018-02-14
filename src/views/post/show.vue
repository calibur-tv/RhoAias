<style lang="scss">
  #post-show {
    background-color: #fff;

    .post {
      .title {
        color: #000;
        font-size: 18px;
        font-weight: 700;
        line-height: 28px;
        margin: 8px 0 15px;
      }

      .user-panel {
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
          margin: 0 10px;
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
      }
    }

    .post-comment-drawer {
      .total {
        padding-left: 17px;
        height: 40px;
        line-height: 40px;
        color: #000;
        font-size: 16px;
      }

      .comments {
        li {
          padding: 1.5px 10px 0;
          font-size: 14px;
          line-height: 19px;

          .nickname {
            color: $color-blue-deep
          }

          .comment-content {
            margin-right: 6px;
          }
        }
      }
    }
  }
</style>

<template>
  <div id="post-show">
    <div class="container">
      <div class="post">
        <h1 class="title" v-text="post.title"></h1>
        <div class="user-panel">
          <router-link class="avatar" :to="$alias.user(master.zone)">
            <img :src="$resize(master.avatar, { width: 70 })">
          </router-link>
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
              @click="$previewImages(post.images, idx)"
            >
              <v-img class="image" :src="img" width="150" mode="2"></v-img>
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
        </div>
      </div>
      <div class="hr"></div>
      <post-reply
        v-for="(item, index) in list"
        :key="item.id"
        :post="item"
        :index="index"
        @delete="deletePost(item.id)"
        @loadcomment="handleCommentLoad"
      ></post-reply>
    </div>
    <more-btn
      :no-more="noMore"
      :loading="loadingLoadMore"
      @fetch="getPosts(false)"
    ></more-btn>
    <v-drawer
      v-model="openCommentModal"
      from="bottom"
      size="100%"
      :header-text="`评论列表 - ${focusReply.floor_count}楼`"
      class="post-comment-drawer"
    >
      <div
        class="container"
      >
        <div class="hr"></div>
        <p class="total">{{ focusReply.comment_count }}条回复</p>
        <ul class="comments">
          <li
            v-for="item in focusComments"
          >
            <router-link class="nickname" :to="$alias.user(item.from_user_zone)" v-text="item.from_user_name"></router-link>
            <template v-if="item.to_user_zone">
              回复
              <router-link class="nickname" :to="$alias.user(item.to_user_zone)" v-text="item.to_user_name"></router-link>
            </template>
            :
            <span class="comment-content">{{ item.content }}</span>
          </li>
        </ul>
      </div>
    </v-drawer>
  </div>
</template>

<script>
  import PostReply from '~/components/post/reply'

  export default {
    name: 'post-show',
    async asyncData ({ route, store, ctx }) {
      await store.dispatch('post/getPost', {
        id: route.params.id,
        ctx,
        only: route.query.only
          ? parseInt(route.query.only, 10) ? 1 : 0
          : 0,
        reset: true
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
        return this.resource.data.list
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
          return {}
        }
        return this.list[this.openCommentIndex]
      }
    },
    data () {
      return {
        loadingLoadMore: false,
        loadingToggleLike: false,
        loadingToggleMark: false,
        openCommentIndex: 0,
        openCommentId: 0,
        openCommentModal: false
      }
    },
    methods: {
      switchOnlyMaster () {
        window.location = this.$alias.post(this.post.id, {
          only: this.onlySeeMaster ? 0 : 1
        })
      },
      deletePost (id) {
        this.$confirm('删除后无法找回, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.$store.dispatch('post/deletePost', {
            ctx: this,
            id
          })
          if (id === this.post.id) {
            window.location = this.$alias.bangumi(this.bangumi.id)
          }
        }).catch(() => {})
      },
      async getPosts (reset) {
        this.loadingLoadMore = true
        await this.$store.dispatch('post/getPost', {
          id: this.post.id,
          ctx: this,
          only: this.onlySeeMaster,
          reset
        })
        this.loadingLoadMore = false
      },
      async toggleLike () {
        if (!this.$store.state.login) {
          this.$channel.$emit('sign-in')
          return
        }
        if (this.isMaster) {
          this.$toast.info('不能给自己点赞')
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
        } catch (err) {
          this.$toast.error(err)
        }
        this.loadingToggleLike = false
      },
      async toggleMark () {
        if (!this.$store.state.login) {
          this.$channel.$emit('sign-in')
          return
        }
        if (this.isMaster) {
          this.$toast.info('不能收藏自己的帖子')
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
        }
        this.loadingToggleMark = false
      },
      handleCommentLoad (data) {
        this.openCommentIndex = data.index
        this.openCommentId = data.id
        this.openCommentModal = true
      }
    }
  }
</script>
