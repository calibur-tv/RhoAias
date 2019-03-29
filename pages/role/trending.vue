<style lang="scss">
#role-trending {
  .banner {
    position: relative;
    height: 100px;

    img {
      position: absolute;
      right: 0;
      top: 0;
      width: auto;
      height: 100px;
      z-index: -1;
    }

    ul {
      margin-left: 40px;
      padding-top: 20px;

      li {
        font-size: 12px;
        line-height: 18px;
        list-style-type: disc;
        color: $color-text-normal;
      }
    }

    .whats-this {
      display: block;
      position: absolute;
      top: 37px;
      right: 65px;
      opacity: 0.7;

      p {
        font-size: 12px;
        background-color: #000;
        color: #fff;
        padding: 4px 6px;
        border-radius: 4px;
      }

      div {
        position: absolute;
        display: block;
        width: 0.8rem;
        height: 0.4rem;
        left: 30px;

        &:before {
          content: '';
          position: absolute;
          border-color: transparent;
          border-style: solid;
          top: 0;
          border-width: 0.4rem 0.4rem 0;
          border-top-color: #000;
        }
      }
    }
  }

  .todo {
    a {
      display: block;
      background-color: $color-pink-light;
      padding: 0 $container-padding;
      font-size: 14px;
      height: 30px;
      line-height: 30px;
      margin: 5px 0;
    }
  }

  .tab-header-item {
    padding: 0 10px;
  }
}
</style>

<template>
  <div id="role-trending">
    <div class="banner">
      <img
        :src="
          $resize('https://image.calibur.tv/owner/image/stock-banner.jpeg', {
            height: 200,
            mode: 2
          })
        "
      >
      <ul v-if="meta">
        <li>投资人数：{{ meta.buyer_count }}</li>
        <li>总交易额：￥{{ parseFloat(meta.money_count).toFixed(2) }}</li>
        <li>成交笔数：{{ meta.deal_count }}</li>
        <li>
          总成交额：￥{{ parseFloat(meta.exchang_money_count).toFixed(2) }}
        </li>
      </ul>
      <nuxt-link class="whats-this" to="/role/trending/intro">
        <p>什么是股市</p>
        <div />
      </nuxt-link>
    </div>
    <VueLayoutTab :headers="tabs" :routable="true" align="center" />
    <div class="todo">
      <nuxt-link v-if="orderCount" to="/role/trending/mine">
        <i class="iconfont icon-nitification" />
        <span>你有「{{ orderCount }}条」采购请求待处理</span>
      </nuxt-link>
      <nuxt-link
        v-for="(item, index) in todo"
        :key="index"
        :to="$alias.cartoonRole(item.id)"
        class="oneline"
      >
        <i class="iconfont icon-nitification" />
        <span>正在召开「{{ item.name }}」的股东大会</span>
      </nuxt-link>
    </div>
    <nuxt-child />
  </div>
</template>

<script>
import VueLayoutTab from 'vue-layout-tab'
import {
  getStockMarketMeta,
  getUserWorkSchedule,
  getMineProductOrderCount
} from '~/api/cartoonRoleApi'

export default {
  name: 'RoleTrending',
  components: {
    VueLayoutTab
  },
  data() {
    return {
      meta: {
        buyer_count: 0,
        money_count: 0,
        deal_count: 0,
        exchang_money_count: 0
      },
      todo: [],
      orderCount: 0
    }
  },
  computed: {
    tabs() {
      const result = [
        {
          label: '产品区',
          route: 'role-trending-product'
        },
        {
          label: '上市榜',
          route: 'role-trending-listed'
        },
        {
          label: '新创榜',
          route: 'role-trending-newbie'
        },
        {
          label: '交易所',
          route: 'role-trending-hall'
        }
      ]
      if (this.isLogin) {
        result.push({
          label: '我的',
          route: 'role-trending-mine'
        })
      }
      return result
    },
    isLogin() {
      return this.$store.state.login
    }
  },
  mounted() {
    this.getMetaInfo()
    if (this.isLogin) {
      this.getUserNeedTodo()
      this.getUserOrderCount()
    } else {
      const canceler = this.$watch('isLogin', () => {
        canceler()
        this.getUserNeedTodo()
        this.getUserOrderCount()
      })
    }
  },
  methods: {
    async getMetaInfo() {
      this.meta = await getStockMarketMeta(this)
    },
    async getUserNeedTodo() {
      this.todo = await getUserWorkSchedule(this)
    },
    async getUserOrderCount() {
      this.orderCount = await getMineProductOrderCount(this)
    }
  }
}
</script>
