<style lang="scss">
.idol-product-order-item {
  margin: 10px;
  box-shadow: rgba(0, 0, 0, 0.2) 0 2px 1px -1px,
    rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px;
  border-radius: 5px;

  .header {
    display: block;
    padding: 10px 15px;
    position: relative;
    color: black;
    font-size: 16px;
    line-height: 24px;

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
  }

  .body {
    display: block;
    padding: 5px 15px;
    font-size: 14px;
    line-height: 20px;
    color: #000;

    .order-item {
      margin-bottom: 10px;
      margin-top: 10px;
    }

    .avatar {
      border-radius: 5px;
      border: 1px solid $color-gray-normal;
      height: 35px;
      width: 35px;
      display: block;
      margin-right: 7px;
      float: left;
    }

    .intro {
      overflow: hidden;

      .price {
        color: black;
        font-size: 14px;
        line-height: 18px;
      }

      .meta {
        color: #8e8e93;
        font-size: 12px;
        line-height: 17px;

        a {
          font-size: 12px;
        }
      }
    }

    .control {
      float: right;

      .resolve {
        color: $color-blue-normal;
      }

      .reject {
        color: $color-pink-normal;
      }
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
  }
}
</style>

<template>
  <li class="idol-product-order-item">
    <nuxt-link
      class="header oneline"
      :to="$alias.post(item.product.id)"
      v-text="item.product.title"
    />
    <div class="body">
      <div v-for="order in item.orders" :key="order.id" class="order-item">
        <nuxt-link :to="$alias.cartoonRole(order.idol.id)" class="avatar">
          <img :src="$resize(order.idol.avatar, { width: 80 })" >
        </nuxt-link>
        <div class="control">
          <template v-if="order.result === 0">
            <button class="resolve" @click="resolveOrder(order.id)">
              同意
            </button>
            <button class="reject" @click="rejectOrder(order.id)">
              拒绝
            </button>
          </template>
          <el-tag v-else :type="computeTagColor(order.result)" size="mini">
            {{ computedOrderResult(order.result) }}
          </el-tag>
        </div>
        <div class="intro">
          <p class="price">
            ￥{{ order.amount }}，偶像占{{ order.income_ratio }}%
          </p>
          <p class="meta">
            <span>经纪人:</span>
            <nuxt-link
              :to="$alias.user(order.buyer.zone)"
              v-text="order.buyer.nickname"
            />
          </p>
        </div>
      </div>
    </div>
    <div class="footer">
      <span>帖子</span>
      <span>{{ status }}</span>
    </div>
  </li>
</template>

<script>
import { checkOrder } from '~/api/cartoonRoleApi'
import { Tag } from 'element-ui'

export default {
  name: 'IdolProductOrderItem',
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
    status() {
      const orders = this.item.orders
      if (orders.some(_ => _.result === 0)) {
        return `待确认${orders.filter(_ => _.result === 0).length}条`
      }
      if (orders.some(_ => _.result === 1)) {
        return `已成交`
      }
      return '未知'
    }
  },
  methods: {
    computeTagColor(result) {
      if (result === 0) {
        return ''
      } else if (result === 1) {
        return 'success'
      } else if (result === 2) {
        return 'danger'
      } else if (result === 3) {
        return 'info'
      } else if (result === 4) {
        return 'warning'
      } else if (result === 5) {
        return 'info'
      }
      return ''
    },
    computedOrderResult(result) {
      if (result === 0) {
        return '待确认'
      } else if (result === 1) {
        return '已同意'
      } else if (result === 2) {
        return '已拒绝'
      } else if (result === 3) {
        return '订单取消'
      } else if (result === 4) {
        return '已售出'
      } else if (result === 5) {
        return '已失效'
      }
      return '未知'
    },
    resolveOrder(order_id) {
      this.$confirm('同意后无法撤回，确认吗？', '同意采购', {
        confirmButtonText: '同意',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            await checkOrder(this, {
              order_id,
              result: 1
            })
            this.refreshList()
            this.$toast.success('交易已达成')
          } catch (e) {
            // do nothing
          }
        })
        .catch(() => {})
    },
    async rejectOrder(order_id) {
      this.$confirm('确认要拒绝吗？', '拒绝采购', {
        confirmButtonText: '拒绝',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            await checkOrder(this, {
              order_id,
              result: 2
            })
            this.refreshList()
            this.$toast.success('已确认')
          } catch (e) {
            // do nothing
          }
        })
        .catch(() => {})
    },
    refreshList() {
      this.$store.dispatch('flow/initData', {
        func: 'getUserProductOrders',
        type: 'page',
        sort: 'news',
        refresh: true
      })
    }
  }
}
</script>
