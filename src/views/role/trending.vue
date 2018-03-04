<style lang="scss">
  #trending-role {
    li {
      position: relative;
      margin-top: 15px;

      &:not(:last-child) {
        @include border-bottom();
      }

      .top {
        position: relative;
        display: block;
        float: right;

        &:before {
          content: attr(data-index);
          line-height: 48px;
        }
      }

      &:first-of-type {
        .top:before {
          color: goldenrod;
          font-size: 28px;
          line-height: 44px;
        }
      }

      &:nth-of-type(2) {
        .top:before {
          color: indianred;
          font-size: 22px;
          line-height: 44px;
        }
      }

      &:nth-of-type(3) {
        .top:before {
          color: silver;
          font-size: 16px;
          line-height: 44px;
        }
      }

      .avatar {
        width: 100px;
        height: 100px;
        display: block;
        float: left;
        overflow: hidden;
        border-radius: 5px;
        margin-right: 10px;
        border: 1px solid $color-gray-normal;

        img {
          width: 100%;
          height: auto;
        }
      }

      .summary {
        overflow: hidden;

        .role {
          display: block;
          font-size: 14px;
          line-height: 20px;
          height: 60px;
          overflow: hidden;

          .name {
            font-weight: bold;
          }

          .intro {
            color: #000;
          }
        }

        .lover {
          height: 40px;
          padding: 10px 0;
          line-height: 20px;
          vertical-align: middle;
          font-size: 13px;
          color: $color-text-normal;

          img {
            width: 20px;
            height: 20px;
            border-radius: 15px;
            vertical-align: middle;
            border: 1px solid $color-gray-normal;
            margin-left: 10px;
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
            margin-right: 2px;
          }
        }
      }
    }
  }
</style>

<template>
  <div id="trending-role">
    <ul class="container">
      <li
        v-for="(item, index) in list"
        :key="item.id"
      >
        <div class="clearfix">
          <router-link :to="$alias.bangumi(item.bangumi_id)" class="avatar">
            <v-img :src="item.avatar" width="90" height="90"></v-img>
          </router-link>
          <div class="summary">
            <router-link :to="$alias.bangumi(item.bangumi_id)" class="role">
              <span class="name" v-text="item.name"></span>
              <span class="intro">：{{ item.intro }}</span>
            </router-link>
            <div class="lover" v-if="item.lover_id">
              <span>守护者：</span>
              <router-link class="fr" :to="$alias.user(item.lover_zone)">
                <span v-text="item.lover_nickname"></span>
                <v-img :src="item.lover_avatar" width="20" height="20"></v-img>
              </router-link>
            </div>
            <div class="lover" v-else></div>
          </div>
          <div class="footer">
            <router-link class="bangumi" :to="$alias.bangumi(item.bangumi_id)" v-text="item.bangumi_name"></router-link>
            <div class="stats">
              <span>
                粉丝:
                {{ $utils.shortenNumber(item.fans_count) }}
              </span>
              <span>
                金币:
                {{ $utils.shortenNumber(item.star_count) }}
              </span>
              <span>排名:</span>
              <span class="top" :data-index="item.fans_count ? index + 1 : '无'"></span>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <more-btn
      :no-more="noMore"
      :loading="loading"
      :length="list.length"
      @fetch="loadMore"
    ></more-btn>
  </div>
</template>

<script>
  export default {
    name: 'TrendingRole',
    async asyncData ({ store }) {
      await store.dispatch('cartoonRole/getTrending')
    },
    computed: {
      list () {
        return this.$utils.orderBy(this.$store.state.cartoonRole.trending.data, 'star_count', 'desc')
      },
      noMore () {
        return this.$store.state.cartoonRole.trending.noMore
      }
    },
    data () {
      return {
        loading: false
      }
    },
    methods: {
      async loadMore () {
        if (this.loading) {
          return
        }
        this.loading = true
        try {
          await this.$store.dispatch('cartoonRole/getTrending')
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>
