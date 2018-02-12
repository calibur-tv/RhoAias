<style lang="scss">
  #homepage {
    .slogan {
      padding: 17px 0 17px 20px;
      position: relative;

      li {
        margin-left: $container-padding;
        padding: 4px 0;
        font-size: 14px;
        color: #4a4a4a;
        word-wrap: break-word;
        list-style-type: disc;
      }

      img {
        position: absolute;
        right: $container-padding;
        top: 25px;
        width: 60px;
      }
    }

    .tabs {
      background-color: #ffffff;
      position: relative;
      height: 40px;
      padding-left: $container-padding;
      padding-right: $container-padding;
      width: 100%;

      button {
        height: 40px;
        line-height: 40px;
        margin-right: 28px;
        color: #000;
        font-size: 14px;

        &.active {
          position: relative;

          &:before {
            content: '';
            position: absolute;
            left: 0;
            bottom: 1px;
            width: 30px;
            height: 2px;
            background: #333;
            border-radius: 3px;
          }
        }
      }
    }

    #posts {
      .mint-loadmore-top {
        font-size: 12px;
      }

      .post {
        background-color: #ffffff;
        padding-top: $container-padding;
        padding-left: $container-padding;
        padding-right: $container-padding;

        .header {
          height: 35px;
          margin-bottom: 9px;

          .avatar {
            margin-right: 10px;
            display: block;
            float: left;
            @include avatar(35px);
          }

          .name {
            vertical-align: middle;
            display: block;
            overflow: hidden;

            p {
              margin-bottom: 3px;
              font-size: 14px;
              color: #333;
            }

            time {
              color: #999;
              font-size: 12px;
            }
          }
        }

        .body {
          display: block;

          .content {
            color: #000;
            font-size: 16px;
            line-height: 24px;
            margin-bottom: 4px;
          }

          .images {
            .image-full {
              height: 190px;
              width: 100%;
            }

            .image-list {
              img {
                width: 32%;
                height: auto;

                &:not(:last-child) {
                  margin-right: 2%;
                }
              }
            }
          }
        }

        .footer {
          height: 44px;
          line-height: 44px;

          .bangumi {
            float: left;
            color: #999;
            font-size: 12px;
          }

          .stats {
            overflow: hidden;
            text-align: right;
            color: #666;

            span {
              margin-left: 10px;
              font-size: 12px;
            }

            i {
              font-size: 18px;
              margin-top: -2px;
              display: inline-block;
              vertical-align: middle;
            }

            .done {
              color: $color-blue-normal;
            }
          }
        }
      }
    }
  }
</style>

<template>
  <div id="homepage">
    <div class="slogan">
      <ul>
        <li>一个「纯粹」的二次元社区</li>
        <li>致力于实现「天下漫友是一家」</li>
        <li>交流观点，沟通想法，结实「朋友」</li>
      </ul>
      <img src="https://image.calibur.tv/owner/slogan" alt="slogan">
    </div>
    <div class="hr"></div>
    <div class="tabs border-bottom">
      <button @click="switchTab('new')" :class="{ 'active': sort === 'new' }">最新</button>
      <button @click="switchTab('hot')" :class="{ 'active': sort === 'hot' }">热门</button>
    </div>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <p>123</p>
    <more-btn
      :no-more="list.noMore"
      :loading="loading"
      @fetch="fetchData(false)"
    ></more-btn>
  </div>
</template>

<script>
  const defaultSort = 'new'

  export default {
    name: 'page-index',
    head: {
      title: '天下漫友是一家'
    },
    async asyncData ({ store, ctx }) {
      await store.dispatch('post/getTrending', {
        sort: defaultSort,
        ctx
      })
    },
    computed: {
      list () {
        return this.$store.state.post.trending[this.sort]
      }
    },
    data () {
      return {
        sort: defaultSort,
        active: defaultSort,
        loading: false
      }
    },
    watch: {
      active (tab) {
        this.sort = tab
        if (!this.$store.state.post.trending[tab].data.length) {
          this.fetchData(false)
        }
      }
    },
    methods: {
      async fetchData (reset = true, force = false) {
        if (this.loading && !force) {
          return
        }

        this.loading = true
        try {
          await this.$store.dispatch('post/getTrending', {
            sort: this.sort,
            ctx: this,
            reset
          })
        } finally {
          this.$refs.loadmore.onTopLoaded()
          this.loading = false
        }
      },
      switchTab (tab) {
        this.sort = tab
        if (!this.$store.state.post.trending[tab].data.length) {
          this.fetchData(false, true)
        }
      },
      imageFilter (images) {
        return images.slice(0, 3)
      }
    }
  }
</script>
