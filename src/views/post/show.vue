<style lang="scss">
  #post-show {
    background-color: #fff;

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

          >* {
            margin-right: 8px;
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
          max-width: 100%;
          height: auto;
        }
      }
    }
  }
</style>

<template>
  <div id="post-show" class="container">
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
            <span>|</span>
            <v-time v-model="post.created_at"></v-time>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="text-area" v-html="post.content"></div>
        <div class="image-area">
          <div class="image-package"
               v-for="(img, idx) in post.images"
               :key="img" @click="$previewImages(post.images, idx)">
            <v-img class="image" :src="img" width="500" mode="2"></v-img>
          </div>
        </div>
      </div>
      <div class="footer">
        <button
          @click="toggleLike"
          :loading="loadingToggleLike"
          round>
          <i class="iconfont icon-guanzhu"></i>
          {{ post.liked ? '已喜欢' : '喜欢' }}{{ post.like_count ? `(${post.like_count})` : '' }}
        </button>
        <button
          @click="toggleMark"
          :loading="loadingToggleMark"
          round
        >
          <i class="iconfont icon-buoumaotubiao44"></i>
          {{ post.marked ? '已收藏' : '收藏' }}{{ post.mark_count ? `(${post.mark_count})` : '' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'post-show',
    async asyncData ({ route, store, ctx }) {
      await store.dispatch('post/getPost', {
        id: route.params.id,
        ctx,
        only: route.query.only
          ? parseInt(route.query.only, 10) ? 1 : 0
          : 0
      })
    },
    components: {
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
        return this.$orderBy(this.resource.data.list, 'id', 'asc')
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
      }
    },
    data () {
      return {
        loadingLoadMore: false,
        loadingToggleLike: false,
        loadingToggleMark: false
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
      async getPosts () {
        this.loadingLoadMore = true
        await this.$store.dispatch('post/getPost', {
          id: this.post.id,
          ctx: this,
          only: this.onlySeeMaster
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
      }
    }
  }
</script>
