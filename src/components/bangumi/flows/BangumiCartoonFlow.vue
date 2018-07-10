<style lang="scss">
  #bangumi-cartoon-flow {
    background-color: #fff;
    padding-top: 15px;

    .sub-title {
      margin-left: $container-padding;
      margin-right: $container-padding;

      button {
        float: right;
        font-size: 12px;
        color: $color-text-normal;
      }
    }

    .cartoon-list {
      width: 302px;
      margin: 0 auto;
    }

    .cartoon {
      width: 145px;
      height: 316px;
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

      .intro {
        height: 55px;
        padding: 5px 15px;
        background-color: #fff;

        .name, .social {
          height: 20px;
          font-size: 12px;
          line-height: 20px;
        }

        .name {
          margin-top: 3px;
        }

        .social {
          color: $color-text-light;
          margin-top: 2px;

          span {
            margin-right: 10px;
          }

          .done {
            color: $color-pink-deep;
          }
        }
      }

      .about {
        height: 51px;
        padding: 10px 15px;
        border-top: 1px solid #F2F2F2;

        .user-avatar {
          display: block;
          margin-right: 10px;
          overflow: hidden;
          float: left;
          @include avatar-2(30px);
        }

        .main-name {
          line-height: 30px;
          font-size: 12px;
          word-wrap: break-word;
          color: $color-text-normal;
        }
      }
    }
  }
</style>

<template>
  <div id="bangumi-cartoon-flow">
    <template v-if="cartoons.list.length">
      <h3 class="sub-title">
        <span>共 {{ cartoons.total }} 集</span>
        <button @click="openSortModal = true">{{ sort === 'desc' ? '有大到小' : '由小到大' }}</button>
      </h3>
      <mt-actionsheet
        :actions="sortActions"
        v-model="openSortModal">
      </mt-actionsheet>
      <ul class="cartoon-list clearfix">
        <li
          v-for="item in cartoons.list"
          :key="item.id"
          class="cartoon"
        >
          <a :href="$alias.image(item.id)">
            <div class="poster-wrap">
              <img :src="$resize(item.source.url, { width: 290, height: 420 })">
              <div class="info">
                <i class="el-icon-picture-outline"></i>
                <span class="image-count" v-text="item.image_count"></span>
              </div>
            </div>
            <div class="intro">
              <p class="name oneline">【 {{ item.part }} 】{{ item.name }}</p>
              <div class="social">
                <span
                  v-if="item.like_count"
                  :class="{ 'done': item.liked }"
                >
                  <i class="iconfont icon-guanzhu"/>
                  {{ item.like_count }}
                </span>
                <span
                  v-if="item.comment_count"
                  :class="{ 'done': item.commented }"
                >
                  <i class="iconfont icon-pinglun1"/>
                  {{ item.comment_count }}
                </span>
                <span v-if="item.view_count">
                  <i class="iconfont icon-ai-eye"/>
                  {{ item.view_count }}
                </span>
              </div>
            </div>
          </a>
          <div class="about">
            <a
              :href="$alias.user(item.user.zone)"
              target="_blank"
              class="user-avatar"
            >
              <img :src="$resize(item.user.avatar, { width: 60 })">
            </a>
            <a
              :href="$alias.user(item.user.zone)"
              target="_blank"
              class="main-name"
              v-text="item.user.nickname"
            ></a>
          </div>
        </li>
      </ul>
    </template>
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
  export default {
    name: 'v-bangumi-cartoon-flow',
    computed: {
      cartoons () {
        return this.$store.state.bangumi.cartoon
      },
      info () {
        return this.$store.state.bangumi.info
      },
      sort () {
        return this.cartoons.sort
      },
      sortActions () {
        return [
          {
            name: '由大到序排序',
            method: () => {
              this.$store.dispatch('bangumi/changeCartoonSort', {
                sort: 'desc',
                ctx: this,
                bangumiId: this.info.id
              })
            }
          },
          {
            name: '由小到大排序',
            method: () => {
              this.$store.dispatch('bangumi/changeCartoonSort', {
                sort: 'asc',
                ctx: this,
                bangumiId: this.info.id
              })
            }
          }
        ]
      }
    },
    data () {
      return {
        loading: false,
        openSortModal: false
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
      }
    }
  }
</script>
