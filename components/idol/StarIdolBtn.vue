<style lang="scss">
.star-idol-btn-wrap {
  .star-idol-btn {
    background-color: #f25d8e;
    box-shadow: 0 4px 4px rgba(255, 112, 159, 0.3);
    color: #fff;
    border-radius: 4px;
    padding: 5px 20px;
    font-size: 12px;

    &.locked {
      background-color: $color-dark-light;
      box-shadow: 0 4px 4px rgba($color-dark-light, 0.3);
    }
  }
}

.buy-idol-stock-drawer {
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
  <div class="star-idol-btn-wrap">
    <button
      :class="{ 'locked': idol.is_locked }"
      class="star-idol-btn"
      @click="openStarDrawer"
    >{{ idol.is_locked ? '已停牌' : '入股' }}</button>
    <v-drawer
      v-model="showDrawer"
      header-text="入股"
      submit-text="确认"
      from="bottom"
      size="70%"
      @submit="submitOrder"
    >
      <div class="buy-idol-stock-drawer container">
        <p class="intro">每股价格：</p>
        <p>￥{{ idol.stock_price }}</p>
        <p class="intro">购买上限：</p>
        <p>{{ maxCanBuy }}股</p>
        <p class="intro">购入份额：</p>
        <el-input-number
          v-model="count"
          :min="maxCount < 1 ? 0.01 : 1"
          :step="0.01"
          :max="+maxCount"
        />
        <p class="intro">账单计算：</p>
        <p>预计支付：{{ needPay }}</p>
        <p>购买后钱包余额：{{ parseFloat(pocket - needPay).toFixed(2) }}</p>
      </div>
    </v-drawer>
  </div>
</template>

<script>
import { InputNumber } from 'element-ui'
import { starRoleAction } from '~/api/cartoonRoleApi'

export default {
  name: 'StarIdolBtn',
  components: {
    InputNumber
  },
  props: {
    idol: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showDrawer: false,
      count: 1
    }
  },
  computed: {
    pocket() {
      if (!this.$store.state.login) {
        return 0
      }
      return +this.$store.state.user.pocket
    },
    maxCanBuy() {
      if (!this.idol.max_stock_count) {
        return '无上限'
      }
      return parseFloat(
        this.idol.max_stock_count - this.idol.star_count
      ).toFixed(2)
    },
    maxCount() {
      const result = parseFloat(this.idol.stock_price) * this.pocket
      if (!this.idol.max_stock_count) {
        return parseFloat(result).toFixed(2)
      }
      const last = this.idol.max_stock_count - this.idol.star_count
      if (last < result) {
        return parseFloat(last).toFixed(2)
      }
      return parseFloat(result).toFixed(2)
    },
    needPay() {
      return (parseFloat(this.idol.stock_price) * this.count).toFixed(2)
    }
  },
  methods: {
    openStarDrawer() {
      if (!this.$store.state.login) {
        this.$channel.$emit('sign-in')
        return
      }
      if (this.idol.is_locked) {
        this.$toast.error('已经停牌了，等待下次挂牌吧')
        return
      }
      this.showDrawer = true
    },
    async submitOrder() {
      if (this.submitting) {
        return
      }
      this.submitting = true
      this.$toast.loading('入股中')
      try {
        await starRoleAction(this, {
          id: this.idol.id,
          amount: this.count
        })
        this.$store.commit('USE_COIN', this.needPay)
        this.$emit('success', {
          count: this.count,
          amount: this.needPay
        })
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>
