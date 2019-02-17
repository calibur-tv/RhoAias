<style lang="scss">
#role-trending-hall {
  .role-trending-header {
    margin: 16px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    span {
      color: rgba(0, 0, 0, 0.54);
      font-size: 14px;
      font-weight: 500;
    }
  }
}

.make-idol-deal-form {
  .intro {
    color: rgb(142, 142, 147);
    margin-top: 10px;
    margin-bottom: 5px;
  }

  p {
    font-size: 14px;
    line-height: 22px;
  }
}
</style>

<template>
  <div id="role-trending-hall">
    <flow-list
      func="getVirtualIdolDealList"
      type="seenIds"
      sort="active"
    >
      <div
        slot="header"
        slot-scope="{ source }"
        class="role-trending-header"
      >
        <span>总共 {{ source.total }} 笔交易</span>
        <span @click="refresh"><i class="el-icon-refresh"/>&nbsp;刷新</span>
      </div>
      <ul slot-scope="{ flow }">
        <deal-idol-item
          v-for="item in flow"
          :key="item.id"
          :item="item"
          @create="openDealDrawer"
          @delete="deleteDeal"
        />
      </ul>
    </flow-list>
    <v-drawer
      v-model="showDealDrawer"
      header-text="股份交易"
      submit-text="成交"
      size="70%"
      from="bottom"
      @submit="makeDeal"
    >
      <div
        v-if="deal"
        class="make-idol-deal-form container"
      >
        <p class="intro">交易信息：</p>
        <p><strong>交易玩家：</strong>{{ deal.user.nickname }}</p>
        <p><strong>交易偶像：</strong>{{ deal.idol.name }}</p>
        <p><strong>每股价格：</strong>{{ deal.product_price }}</p>
        <p class="intro">购买份额：</p>
        <el-input-number
          v-model="buyCount"
          :step="0.01"
          :min="+minBuyCount"
          :max="+maxBuyCount"
        />
        <p class="intro">支付金额：</p>
        <p>最多可购买：{{ maxBuyCount }}股</p>
        <p>待支付金额：￥{{ payAmount }}</p>
      </div>
    </v-drawer>
  </div>
</template>

<script>
import FlowList from '~/components/flow/FlowList'
import DealIdolItem from '~/components/idol/DealIdolItem'
import { InputNumber } from 'element-ui'
import {
  makeCartoonRoleDeal,
  deleteCartoonRoleDeal
} from '~/api/cartoonRoleApi'

export default {
  name: 'RoleTrendingHall',
  async asyncData({ store }) {
    await store.dispatch('flow/initData', {
      func: 'getVirtualIdolDealList',
      type: 'seenIds',
      sort: 'active'
    })
  },
  components: {
    FlowList,
    DealIdolItem,
    'el-input-number': InputNumber
  },
  head: {
    title: '交易所'
  },
  data() {
    return {
      deal: null,
      loading: false,
      showDealDrawer: false,
      submitting: false,
      buyCount: 0.01,
      minBuyCount: 0
    }
  },
  computed: {
    currentUserId() {
      return this.$store.state.login ? this.$store.state.user.id : 0
    },
    pocket() {
      if (!this.$store.state.login) {
        return 0
      }
      return +this.$store.state.user.pocket
    },
    maxBuyCount() {
      if (!this.deal) {
        return 0
      }
      const result = parseFloat(this.pocket / this.deal.product_price).toFixed(
        2
      )
      if (result - this.deal.last_count < 0) {
        return result
      }
      return this.deal.last_count
    },
    payAmount() {
      if (!this.deal || !this.buyCount) {
        return 0
      }
      return parseFloat(this.buyCount * this.deal.product_price).toFixed(2)
    }
  },
  methods: {
    async refresh() {
      if (this.loading) {
        return
      }
      await this.$store.dispatch('flow/initData', {
        func: 'getVirtualIdolDealList',
        type: 'seenIds',
        sort: 'active',
        refresh: true
      })
      this.loading = false
    },
    openDealDrawer(deal) {
      if (!this.currentUserId) {
        this.$channel.$emit('sign-in')
        return
      }
      this.minBuyCount = parseFloat(0.01 / deal.product_price).toFixed(2)
      this.deal = deal
      this.showDealDrawer = true
    },
    async makeDeal() {
      if (!this.payAmount) {
        this.$toast.error('未选择份额')
        return
      }
      if (this.pocket < this.payAmount) {
        this.$toast.error('没有足够的虚拟币')
        return
      }
      if (this.submitting) {
        return
      }
      this.submitting = true
      this.$toast.loading('交易中')
      try {
        await makeCartoonRoleDeal(this, {
          deal_id: this.deal.id,
          buy_count: this.buyCount,
          pay_price: this.payAmount
        })
        this.$toast.success('交易成功')
        this.refresh()
      } finally {
        this.submitting = false
      }
    },
    deleteDeal(deal) {
      this.$confirm('确定要终止交易吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await deleteCartoonRoleDeal(this, { id: deal.id })
          this.$toast.success('交易已终止')
          this.refresh()
        })
        .catch()
    }
  }
}
</script>
