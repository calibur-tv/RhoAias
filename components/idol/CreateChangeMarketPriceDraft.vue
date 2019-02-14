<style lang="scss">
#create-change-market-price-draft {
  p {
    margin-top: 15px;
    margin-bottom: 15px;
    font-weight: 500;
    font-size: 14px;
  }

  ul {
    margin-left: 15px;
    margin-top: 5px;

    li {
      list-style-type: disc;
      line-height: 22px;
      font-size: 13px;
      margin-bottom: 10px;
    }
  }

  .submit-btn {
    width: 100%;
    margin-bottom: 30px;
  }
}
</style>

<template>
  <div id="create-change-market-price-draft">
    <p>增发规则：</p>
    <ul>
      <li>每次增发的股份，不能小于 {{ minLevel }} 股</li>
      <li>现阶段，不支持以每股价格低于 1.00 或高于 10.00 的价格进行增发</li>
      <li>提案发起后，需要超过 2/3 的票数持股人在「大事记」栏投票表决通过后才会增发</li>
    </ul>
    <p>设置股价：</p>
    <el-input-number
      v-model="stock_form.new_price"
      :min="1"
      :max="10"
      :step="0.01"
    />
    <p>设置份额：</p>
    <el-input-number
      v-model="stock_form.add_stock_count"
      :step="1"
      :min="minLevel"
    />
    <p>当前增发市值：￥{{ curAddPrice }}</p>
    <p>增发后总市值：￥{{ totalMarketPrice }}</p>
    <el-button
      :loading="stock_form.submitting"
      type="primary"
      class="submit-btn"
      @click="submitAddStock"
    >
      确认增发
    </el-button>
  </div>
</template>

<script>
import { createMarketPriceDraft } from '~/api/cartoonRoleApi'
import { InputNumber } from 'element-ui'

export default {
  name: 'CreateChangeMarketPriceDraft',
  components: {
    'el-input-number': InputNumber
  },
  props: {
    idol: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      minLevel: 500,
      stock_form: {
        submitting: false,
        new_price: 0,
        add_stock_count: 0
      }
    }
  },
  computed: {
    minAddPrice() {
      let result
      if (this.idol.star_count < 4000) {
        result = this.idol.market_price * 0.25
      } else {
        result = this.idol.market_price * 0.1
      }
      if (result < this.minLevel) {
        return parseFloat(this.minLevel).toFixed(2)
      }
      return parseFloat(result).toFixed(2)
    },
    curAddPrice() {
      return parseFloat(
        this.stock_form.new_price * this.stock_form.add_stock_count
      ).toFixed(2)
    },
    totalMarketPrice() {
      return parseFloat(+this.idol.market_price + +this.curAddPrice).toFixed(2)
    }
  },
  methods: {
    async submitAddStock() {
      if (this.stock_form.submitting) {
        return
      }
      this.stock_form.submitting = true
      try {
        await createMarketPriceDraft(this, {
          idol_id: this.idol.id,
          add_stock_count: this.stock_form.add_stock_count,
          stock_price: this.stock_form.new_price
        })
        this.$toast.success('修改成功')
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } catch (e) {
        this.stock_form.submitting = false
      }
    }
  }
}
</script>
