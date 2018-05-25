<style lang="scss">
  #image-album {
    .header {
      margin-top: $container-padding;
      margin-bottom: $container-padding;

      .title {
        font-size: 20px;
        margin-bottom: 10px;
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

    .body {
      background-color: #fff;

      .images-wrap {
        .image-package {
          position: relative;
        }
      }

      .cartoon-list {
        margin-top: 20px;

        li {
          width: 25%;
          display: inline-block;
          text-align: center;
          margin-bottom: 7px;
          padding: 0 10px;
        }

        a {
          border: 1px solid $color-gray-deep;
          height: 30px;
          color: $color-link;
          border-radius: 4px;
          display: block;
          font-size: 12px;
          line-height: 28px;
        }

        .router-link-active {
          border-color: $color-blue-light;
          background-color: $color-blue-light;
          color: $color-white;
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

    .footer {
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
      <div class="header">
        <h1 class="title oneline">
          {{ info.is_creator ? '[原创]' : '[转载]' }}
          [{{ info.is_cartoon ? '漫画' : '相册' }}]
          {{ info.name }}
        </h1>
        <router-link :to="$alias.user(user.zone)" class="author">
          <img class="avatar" :src="$resize(user.avatar, { width: 60 })">
          {{ user.nickname }}
          ·
          <v-time v-model="info.updated_at"></v-time>
        </router-link>
      </div>
    </div>
    <div class="body">
      <div class="images-wrap">
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
            :aspect="$computeImageAspect(img.url)"
          ></v-img>
        </div>
      </div>
      <ul class="cartoon-list" v-if="cartoon.length">
        <li v-for="item in cartoon">
          <router-link
            :to="$alias.imageAlbum(item.id)"
            v-text="item.name"
            class="oneline"
          ></router-link>
        </li>
      </ul>
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
    <div class="hr"></div>
    <div class="container">
      <div class="footer">
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

  export default {
    name: 'image-album',
    async asyncData ({ store, route, ctx }) {
      await store.dispatch('image/getAlbumData', {
        ctx,
        id: route.params.id
      })
    },
    head () {
      const category = `${this.info.is_cartoon ? '漫画' : '相簿'}`
      return {
        title: `${this.info.name} - ${category}`,
        meta: [
          { hid: 'description', name: 'description', content: this.bangumi.summary },
          { hid: 'keywords', name: 'keywords', content: `${this.info.name}，${this.bangumi.name}，${category}，${this.user.nickname}` }
        ]
      }
    },
    computed: {
      id () {
        return this.$route.params.id
      },
      album () {
        return this.$store.state.image.albumShow
      },
      info () {
        return this.album.info
      },
      images () {
        return this.album.images
      },
      cartoon () {
        return this.album.cartoon
      },
      previewImages () {
        return this.images.map(_ => _.url)
      },
      user () {
        return this.album.user
      },
      bangumi () {
        return this.album.bangumi
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
      }
    },
    methods: {
      handleBangumiFollow (result) {
        this.$store.commit('image/FOLLOW_ALBUM_BANGUMI', { result })
      },
      toggleLike () {
        if (!this.$store.state.login) {
          this.$channel.$emit('sign-in')
          return
        }
        if (this.isMine) {
          this.$toast.error('不能为自己的相簿点赞')
          return
        }
        if (this.loadingFollowAlbum) {
          return
        }
        this.loadingFollowAlbum = true
        if (this.info.is_creator && !this.info.liked) {
          this.$confirm('原创相簿点赞需要金币, 是否继续?', '提示', {
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
    }
  }
</script>
