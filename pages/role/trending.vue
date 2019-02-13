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
  }
}
</style>

<template>
  <div id="role-trending">
    <div class="banner">
      <img :src="$resize('https://image.calibur.tv/owner/image/stock-banner.jpeg', { height: 200, mode: 2 })">
      <ul v-if="meta">
        <li>投资人数：{{ meta.buyer_count }}</li>
        <li>总交易额：￥{{ parseFloat(meta.money_count).toFixed(2) }}</li>
        <li>成交笔数：{{ meta.deal_count }}</li>
        <li>总成交额：￥{{ parseFloat(meta.exchang_money_count).toFixed(2) }}</li>
      </ul>
    </div>
    <tab-container
      :headers="tabs"
      :router="true"
    />
    <nuxt-child />
  </div>
</template>

<script>
import TabContainer from '~/components/common/TabContainer'
import { getStockMarketMeta } from '~/api/cartoonRoleApi'

export default {
  name: 'RoleTrending',
  components: {
    TabContainer
  },
  props: {},
  data() {
    return {
      meta: {
        buyer_count: 0,
        money_count: 0,
        deal_count: 0,
        exchang_money_count: 0
      }
    }
  },
  computed: {
    tabs() {
      const result = [
        {
          label: '已上市',
          route: 'role-trending-listed'
        },
        {
          label: '融资中',
          route: 'role-trending-newbie'
        },
        {
          label: '交易所',
          route: 'role-trending-hall'
        },
        {
          label: '功能简介',
          route: 'role-trending-intro'
        }
      ]
      if (this.$store.state.login) {
        result.push({
          label: '我的',
          route: 'role-trending-mine'
        })
      }
      return result
    }
  },
  mounted() {
    this.getMetaInfo()
  },
  methods: {
    async getMetaInfo() {
      this.meta = await getStockMarketMeta(this)
    }
  }
}
</script>
