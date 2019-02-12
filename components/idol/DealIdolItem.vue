<style lang="scss">
.deal-idol-item {
  margin: 10px;
  box-shadow: rgba(0, 0, 0, 0.2) 0 2px 1px -1px,
    rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px;
  border-radius: 5px;
  background-color: #fff;

  .header {
    padding: 10px 15px;
    position: relative;

    &:after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 1px;
      background-color: rgb(225, 225, 225);
      transform: scaleY(0.5);
    }

    img {
      display: block;
      float: left;
      width: 35px;
      height: 35px;
      border: 1px solid $color-gray-normal;
      margin-right: 8px;
    }

    .intro {
      height: 40px;
      overflow: hidden;

      .name {
        color: rgb(0, 0, 0);
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
      }

      .nickname {
        color: rgb(142, 142, 147);
        font-size: 12px;
        font-weight: 400;
        line-height: 18px;
      }
    }
  }

  .body {
    padding: 15px;
    font-size: 14px;
    line-height: 20px;
    color: #000;

    .intro {
      margin-bottom: 10px;
      color: rgb(142, 142, 147);
    }

    .badge {
      margin-top: 10px;
    }
  }

  .footer {
    padding: 10px 15px;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background-color: rgb(225, 225, 225);
      transform: scaleY(0.5);
    }

    span {
      color: rgb(109, 109, 114);
      font-size: 14px;
    }

    button {
      font-size: 14px;

      &.create {
        color: $color-pink-deep;
      }

      &.delete {
        color: $color-blue-deep;
      }
    }
  }
}
</style>

<template>
  <li class="deal-idol-item">
    <div class="header">
      <nuxt-link :to="$alias.cartoonRole(item.idol.id)">
        <img :src="$resize(item.idol.avatar, { width: 70, height: 70 })">
      </nuxt-link>
      <div class="intro">
        <nuxt-link :to="$alias.cartoonRole(item.idol.id)">
          <p
            class="name oneline"
            v-text="item.idol.name"
          />
        </nuxt-link>
        <nuxt-link
          v-if="item.user"
          :to="$alias.user(item.user.zone)"
        >
          <p class="nickname oneline">
            交易人：{{ item.user.nickname }}
          </p>
        </nuxt-link>
      </div>
    </div>
    <div class="body">
      <p class="intro">股价详情：</p>
      <p>当前市值：￥{{ item.idol.market_price }}</p>
      <p>每股股价：￥{{ item.idol.stock_price }}</p>
      <p>发行股数：{{ item.idol.star_count }}</p>
      <p class="intro badge">交易详情：</p>
      <p>交易编号：#&nbsp;{{ item.id }}</p>
      <p>出售股价：￥{{ item.product_price }}</p>
      <p>出售股数：{{ item.product_count }}</p>
      <p>已成交数：{{ parseFloat(item.product_count - item.last_count).toFixed(2) }}</p>
      <div class="badge">
        <el-tag
          :type="computePriceColor(item)"
          size="mini"
        >{{ computePriceText(item) }}</el-tag>
        <el-tag
          size="mini"
          type="info"
        >占比:{{ parseFloat(item.product_count / item.idol.star_count * 100).toFixed(2) }}%</el-tag>
        <el-tag
          v-if="item.idol.is_locked"
          size="mini"
          type="danger"
        >已停牌</el-tag>
        <el-tag
          v-else
          size="mini"
          type="success"
        >挂牌中</el-tag>
      </div>
    </div>
    <div class="footer">
      <span>发起时间：{{ item.created_at.split(' ')[0] }}</span>
      <button
        v-if="isMine"
        class="delete"
        @click="deleteDeal"
      >终止交易</button>
      <button
        v-else
        class="create"
        @click="makeDeal"
      >马上交易</button>
    </div>
  </li>
</template>

<script>
import { Tag } from 'element-ui'

export default {
  name: 'DealIdolItem',
  components: {
    'el-tag': Tag
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    isMine() {
      if (!this.$store.state.login) {
        return false
      }
      if (!this.item.user) {
        return true
      }
      return this.$store.state.user.id === this.item.user.id
    }
  },
  methods: {
    computePriceText(row) {
      const result = row.product_price - row.idol.stock_price
      if (result > 0) {
        return '高于市场价'
      } else if (result === 0) {
        return '等于市场价'
      }
      return '低于市场价'
    },
    computePriceColor(row) {
      const result = row.product_price - row.idol.stock_price
      if (result > 0) {
        return 'danger'
      } else if (result === 0) {
        return 'info'
      }
      return 'success'
    },
    makeDeal() {
      this.$emit('create', this.item)
    },
    deleteDeal() {
      this.$emit('delete', this.item)
    }
  }
}
</script>
