<style lang="scss">
  #image-album {
    .album-header {
      margin-top: $container-padding;
      margin-bottom: $container-padding;

      .title {
        font-size: 20px;
        margin-bottom: 15px;
      }

      .author {
        font-size: 13px;

        .avatar {
          vertical-align: middle;
          border: 1px solid $color-gray-normal;
          border-radius: 50%;
          @include avatar(30px);
        }
      }
    }

    .album-body {
      background-color: #fff;

      .images-wrap {
        .image-package {
          position: relative;
        }
      }

      .no-image {
        text-align: center;
        padding-top: 30px;
        padding-bottom: 20px;
        color: $color-text-normal;
        font-size: 13px;
      }

      .cartoon-list {
        margin-top: 20px;
        position: relative;

        .sub-title {
          margin-left: 10px;

          .next {
            float: right;
            font-size: 13px;
            margin-right: 10px;
            margin-left: 15px;
            color: $color-text-normal;
          }

          .more {
            float: right;
            font-size: 13px;
            margin-right: 10px;
            margin-left: 15px;
            color: $color-text-normal;
          }
        }

        li {
          width: 50%;
          display: inline-block;
          text-align: center;
          margin-bottom: 7px;
          padding: 0 5px;

          a {
            border: 1px solid $color-gray-deep;
            height: 30px;
            color: $color-link;
            border-radius: 4px;
            display: block;
            font-size: 12px;
            line-height: 28px;

            &.active {
              border-color: $color-blue-light;
              background-color: $color-blue-light;
              color: $color-white;
            }
          }
        }
      }

      .reward-panel {
        text-align: center;
        margin-top: 30px;
        margin-bottom: 30px;

        button {
          margin: 0 5px;
          font-size: 13px;

          i {
            font-size: 12px;
            line-height: 16px;
          }
        }

        .album-rewarded-btn {
          @include btn-empty(#eb9e05);
        }

        .album-reward-btn {
          @include btn-empty(#ffffff, #eb9e05);
        }

        .album-liked-btn {
          @include btn-empty(#fa5555);
        }

        .album-like-btn {
          @include btn-empty(#ffffff, #fa5555);
        }
      }
    }

    .album-footer {
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
  }
</style>

<template>
  <div id="image-album">
    <div class="container">
      <div class="album-header">
        <h1 class="title oneline">
          {{ info.is_creator ? '[原创]' : '[转载]' }}
          [{{ info.is_cartoon ? '漫画' : '相册' }}]
          {{ info.name }}
        </h1>
        <a :href="$alias.user(user.zone)" class="author">
          <img class="avatar" :src="$resize(user.avatar, { width: 60 })">
          {{ user.nickname }}
          ·
          <v-time v-model="info.created_at"></v-time>
        </a>
      </div>
    </div>
    <div class="album-body">
      <div class="images-wrap" v-if="info.is_album">
        <div
          class="image-package"
          v-for="(img, idx) in images"
          :key="img.id"
        >
          <v-img
            class="image"
            width="400"
            mode="2"
            :src="img.url"
            :aspect="$computeImageAspect(img)"
          ></v-img>
        </div>
        <p
          v-if="!info.image_count"
          class="no-image"
        >
          还没有上传图片
        </p>
      </div>
      <div
        class="image-package"
        v-else
      >
        <v-img
          class="image"
          width="400"
          mode="2"
          :src="source.url"
          :aspect="$computeImageAspect(source)"
        ></v-img>
      </div>
      <div class="cartoon-list" v-if="info.is_cartoon">
        <h3 class="sub-title">
          选集（{{ cartoon.length }}）
          <a class="next" v-if="nextPartUrl" :href="nextPartUrl">下一话</a>
          <div class="more" v-if="showMoreBtn" @click="showAll = !showAll">{{ showAll ? '收起' : '展开' }}</div>
        </h3>
        <ul>
          <li v-for="item in sortCartoons">
            <a
              :href="$alias.image(item.id)"
              v-text="item.name"
              class="oneline"
              :class="{ 'active': item.id === id }"
            ></a>
          </li>
        </ul>
      </div>
      <div class="container">
        <div class="reward-panel">
          <button
            :class="info.is_creator ? [ info.liked ? 'album-rewarded-btn' : 'album-reward-btn' ] :  [ info.liked ? 'album-liked-btn' : 'album-like-btn' ]"
            @click="toggleLike"
          >
            <i class="iconfont icon-guanzhu"></i>
            {{ likeAlbumBtnText }}
          </button>
        </div>
      </div>
    </div>
    <div class="container">
      <comment-main
        :id="id"
        :master-id="user.id"
        type="image"
      ></comment-main>
      <div class="hr"></div>
      <div class="album-footer">
        <div class="bangumi-panel">
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
      </div>
    </div>
  </div>
</template>

<script>
  import Api from '~/api/imageApi'
  import CommentMain from '~/components/comments/CommentMain'

  export default {
    name: 'image-album',
    async asyncData ({ store, route, ctx }) {
      const id = route.params.id
      await Promise.all([
        store.dispatch('image/show', { ctx, id }),
        store.dispatch('comment/getMainComments', {
          ctx,
          id,
          type: 'image',
          seeReplyId: route.query.reply
        })
      ])
    },
    head () {
      return {
        title: this.info.name
      }
    },
    components: {
      CommentMain
    },
    computed: {
      id () {
        return +this.$route.params.id
      },
      info () {
        return this.$store.state.image.show
      },
      source () {
        return this.info.source
      },
      images () {
        return this.info.images
      },
      cartoon () {
        return this.info.parts
      },
      user () {
        return this.info.user
      },
      bangumi () {
        return this.info.bangumi
      },
      likeAlbumBtnText () {
        const text = this.info.is_creator
          ? this.info.liked ? '已赞赏' : '赞赏'
          : this.info.liked ? '已喜欢' : '喜欢'

        return this.info.like_count ? `${text}(${this.info.like_count})` : text
      },
      isMine () {
        return this.$store.state.login
          ? this.user.id === this.$store.state.user.id
          : false
      },
      showMoreBtn () {
        return this.take < this.cartoon.length
      },
      sortCartoons () {
        const begin = (this.page - 1) * this.take
        return this.showAll ? this.cartoon : this.cartoon.slice(begin, begin + this.take)
      },
      nextPartUrl () {
        if (!this.info.is_cartoon || !this.cartoon.length) {
          return ''
        }
        let index = 0
        this.cartoon.forEach((item, idx) => {
          if (item.id === this.id) {
            index = idx
          }
        })
        if (index >= this.cartoon.length - 1) {
          return ''
        }
        return this.$alias.image(this.cartoon[index + 1].id)
      }
    },
    data () {
      return {
        take: 4,
        page: 0,
        part: 0,
        showAll: false
      }
    },
    methods: {
      handleBangumiFollow (result) {
        this.$store.commit('image/FOLLOW_ALBUM_BANGUMI', { result })
      },
      computePage () {
        if (!this.info.is_cartoon) {
          return
        }
        this.cartoon.forEach((meta, index) => {
          if (meta.id === this.id) {
            this.part = index + 1
          }
        })
        this.page = Math.ceil(this.part / this.take)
      },
      toggleLike () {
        if (!this.$store.state.login) {
          this.$channel.$emit('sign-in')
          return
        }
        if (this.isMine) {
          this.$toast.error('不能为自己的相册点赞')
          return
        }
        if (this.loadingFollowAlbum) {
          return
        }
        this.loadingFollowAlbum = true
        if (this.info.is_creator && !this.info.liked) {
          this.$confirm('原创相册点赞需要金币, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.submitLikeRequest()
          }).catch(() => {})
          return
        }
        this.submitLikeRequest()
      },
      async submitLikeRequest () {
        const api = new Api(this)
        try {
          const result = await api.toggleLike({
            id: this.id
          })
          this.$store.commit('image/ALBUM_LIKE', { result })
          this.$toast.success('操作成功')
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.loadingFollowAlbum = false
        }
      }
    },
    mounted () {
      this.computePage()
    }
  }
</script>
