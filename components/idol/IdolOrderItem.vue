<style lang="scss">
.idol-order-item {
  margin: 10px 0;
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

    .avatar {
      float: left;

      img {
        display: block;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        border: 1px solid $color-gray-normal;
        margin-right: 7px;
      }
    }

    .info {
      overflow: hidden;
      height: 35px;

      p {
        color: black;
        font-size: 14px;
        font-weight: 500;
        line-height: 19px;
      }

      .meta {
        color: #8e8e93;
        font-size: 12px;
        font-weight: 400;
        line-height: 18px;
      }
    }
  }

  .body {
    display: block;
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

      &.pub-btn {
        color: $color-pink-deep;
      }

      &.mine-btn {
        color: rgb(109, 109, 114);
      }

      &.can-deal {
        color: $color-blue-deep;
      }
    }
  }
}
</style>

<template>
  <li class="idol-order-item">
    <div class="header">
      <nuxt-link class="avatar" :to="$alias.user(item.buyer.zone)">
        <img :src="$resize(item.buyer.avatar, { width: 80 })" />
      </nuxt-link>
      <div class="info">
        <nuxt-link
          class="name oneline"
          :to="$alias.post(item.product.id)"
          v-text="item.product.title"
        />
        <div class="meta">
          <span>采购帖子</span>
        </div>
      </div>
    </div>
    <nuxt-link class="body" :to="$alias.post(item.product.id)">
      <p class="intro">订单详情：</p>
      <p>价格：￥{{ item.amount }}</p>
      <p>分成：偶像占{{ item.income_ratio }}%</p>
      <p>
        状态：<el-tag size="mini" :type="computeTagColor">{{
          computedResult
        }}</el-tag>
      </p>
    </nuxt-link>
    <div class="footer">
      <span>时间：{{ item.created_at.split(' ')[0] }}</span>
      <button v-if="state === 0" @click="cancelOrder(item.id)">
        取消订单
      </button>
    </div>
  </li>
</template>

<script>
import { deleteOrder } from '~/api/cartoonRoleApi'
import { Tag } from 'element-ui'

export default {
  name: 'IdolOrderItem',
  components: {
    'el-tag': Tag
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      state: this.item.result
    }
  },
  computed: {
    computeTagColor() {
      const result = this.state
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
    computedResult() {
      const result = this.state
      if (result === 0) {
        return '等待作者确认'
      } else if (result === 1) {
        return '已采购成功'
      } else if (result === 2) {
        return '作者已拒绝'
      } else if (result === 3) {
        return '订单已取消'
      } else if (result === 4) {
        return '作品已出售'
      } else if (result === 5) {
        return '作品已失效'
      }
      return '未知状态'
    }
  },
  methods: {
    cancelOrder(order_id) {
      if (this.loading) {
        return
      }
      this.$confirm('确认执行该操作吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            this.loading = true
            await deleteOrder(this, { order_id })
            this.$toast.success('订单已取消')
            this.state = 3
          } catch (e) {
            this.$toast.error(e)
          } finally {
            this.loading = false
          }
        })
        .catch()
    }
  }
}
</script>
