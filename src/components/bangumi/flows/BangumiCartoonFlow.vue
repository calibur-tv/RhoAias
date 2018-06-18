<style lang="scss">
  #bangumi-cartoon-flow {
    ul {
      width: 302px;
      margin: 15px auto;
    }

    li {
      width: 145px;
      height: 282px;
      float: left;
      box-shadow: 0 1px 3px rgba(0,0,0,.2);
      margin: 3px 3px 10px;
      overflow: hidden;

      .poster-wrap {
        position: relative;
        display: block;

        &:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 50px;
          opacity: .3;
          background-color: transparent;
          background-image: linear-gradient(transparent,rgba(0,0,0,.1) 20%,rgba(0,0,0,.2) 35%,rgba(0,0,0,.6) 65%,rgba(0,0,0,.9));
        }

        img {
          width: 100%;
          height: 210px;
          display: block;
        }

        .info {
          position: absolute;
          left: 7px;
          bottom: 4px;
          z-index: 1;
          color: #fff;
          line-height: 20px;

          i {
            font-size: 20px;
            vertical-align: middle;
          }

          .image-count {
            margin-left: 5px;
            font-size: 14px;
            vertical-align: middle;
          }
        }
      }

      .desc {
        padding: 5px 8px;
        background-color: #fff;

        button {
          float: right;
          width: 40px;
          height: 20px;
          line-height: 20px;
          text-align: right;
          color: $color-gray-deep;
          font-size: 12px;
          margin-right: 1px;

          &.liked {
            color: $color-pink-normal;
          }
        }

        a {
          display: block;
          overflow: hidden;
          font-size: 12px;
          line-height: 20px;
        }
      }

      .user {
        display: block;
        padding: 8px;
        border-top: 1px solid #f2f2f2;
        background-color: #fafafa;
        font-size: 12px;
        line-height: 14px;
        color: #999;
        height: 42px;

        img {
          border: 1px solid #f0f0f0;
          vertical-align: middle;
          margin-right: 8px;
          float: left;
          border-radius: 50%;
          @include avatar(26px)
        }

        div {
          overflow: hidden;
          font-size: 12px;
          margin-top: 6px;
          color: #999;
        }
      }
    }

    .loadmore {
      background-color: transparent;
    }
  }
</style>

<template>
  <div id="bangumi-cartoon-flow">
    <ul class="clearfix" v-if="cartoons.list.length">
      <li
        v-for="item in cartoons.list"
        :key="item.id"
      >
        <a class="poster-wrap" :href="$alias.imageAlbum(item.id)" target="_blank">
          <img :src="$resize(item.url, { width: 290, height: 420 })">
          <div class="info">
            <i class="el-icon-picture-outline"></i>
            <span class="image-count" v-text="item.image_count"></span>
          </div>
        </a>
        <div class="desc">
          <button class="like" :class="{ 'liked': item.liked }" @click="handleLikeCartoon($event, item)">
            <i class="iconfont icon-msnui-love"></i>
            {{ item.like_count || ''  }}
          </button>
          <a class="oneline" :href="$alias.imageAlbum(item.id)" target="_blank" v-text="item.name"></a>
        </div>
        <a class="user" :href="$alias.user(item.user.zone)" target="_blank">
          <img :src="$resize(item.user.avatar, { width: 72 })">
          <div class="oneline" v-text="item.user.nickname"></div>
        </a>
      </li>
    </ul>
    <more-btn
      :no-more="cartoons.noMore"
      :length="cartoons.list.length"
      :loading="loading"
      @fetch="getCartoons"
    >
      <button @click="openFeedbackForCartoon">求漫画</button>
    </more-btn>
  </div>
</template>

<script>
  import ImageApi from '~/api/imageApi'

  export default {
    name: 'v-bangumi-cartoon-flow',
    computed: {
      cartoons () {
        return this.$store.state.bangumi.cartoon
      },
      info () {
        return this.$store.state.bangumi.info
      }
    },
    data () {
      return {
        loading: false
      }
    },
    created () {
      if (!this.cartoons.list.length) {
        this.getCartoons()
      }
    },
    methods: {
      async getCartoons () {
        if (this.loading) {
          return
        }
        this.loading = true

        try {
          await this.$store.dispatch('bangumi/getCartoons', {
            ctx: this,
            bangumiId: this.info.id
          })
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.loading = false
        }
      },
      openFeedbackForCartoon () {
        this.$channel.$emit('open-feedback', {
          type: 7,
          desc: `我想看《${this.info.name}》的漫画第 ? 话`
        })
      },
      handleLikeCartoon (e, image) {
        if (!this.$store.state.login) {
          this.$channel.$emit('sign-in')
          return
        }
        if (image.user_id === this.$store.state.user.id) {
          this.$toast.info('不能为自己的图片点赞')
          return
        }
        const btn = e.currentTarget
        if (!image.liked) {
          this.$confirm('原创图片点赞需要金币, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.submitToggleLikeCartoon(btn, image)
          }).catch(() => {})
          return
        }
        this.submitToggleLikeCartoon(btn, image)
      },
      async submitToggleLikeCartoon (btn, image) {
        btn.setAttribute('disabled', 'disabled')
        const api = new ImageApi(this)
        try {
          const result = await api.toggleLike({ id: image.id })
          if (image.creator && result) {
            this.$store.commit('USE_COIN')
          }
          this.$toast.success('操作成功')
          this.$store.commit('bangumi/TOGGLE_LIKE_CARTOON', {
            id: image.id,
            result
          })
        } catch (e) {
          this.$toast.error(e)
        } finally {
          btn.removeAttribute('disabled')
        }
      }
    }
  }
</script>
