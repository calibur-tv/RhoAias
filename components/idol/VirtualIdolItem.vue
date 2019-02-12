<style lang="scss">
.virtual-idol-item {
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
      width: 35px;
      height: 35px;
      border-radius: 50%;
      border: 1px solid $color-gray-normal;
      float: left;
      margin-right: 7px;
    }

    p {
      font-size: 17px;
      color: #000;
      line-height: 35px;
    }
  }

  .body {
    padding: 15px;
    font-size: 14px;
    line-height: 20px;
    color: #000;

    .badges {
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
  <li class="virtual-idol-item">
    <nuxt-link :to="$alias.cartoonRole(item.id)">
      <div class="header">
        <img :src="$resize(item.avatar, { width: 70, height: 70 })">
        <p
          class="name oneline"
          v-text="item.name"
        />
      </div>
      <div class="body">
        <p>当前市值：￥{{ item.company_state ? item.market_price : '未上市' }}</p>
        <p>每股股价：￥{{ item.stock_price }}</p>
        <p>投资人数：{{ item.fans_count }}</p>
        <p>认购股数：{{ item.star_count }}</p>
        <div
          v-if="sort === 'mine'"
          class="badges"
        >
          <el-tag
            v-if="item.is_locked"
            size="mini"
            type="danger"
          >已停牌</el-tag>
          <el-tag
            v-else
            size="mini"
            type="success"
          >挂牌中</el-tag>
          <el-tag
            size="mini"
            type="info"
          >{{ item.company_state ? '已上市' : '未上市' }}</el-tag>
        </div>
      </div>
      <div class="footer">
        <span v-if="item.ipo_at">上市时间：{{ item.ipo_at.split(' ')[0] }}</span>
        <span v-else>注册时间：{{ item.created_at.split(' ')[0] }}</span>
        <template
          v-if="sort === 'mine'"
        >
          <button
            v-if="item.company_state"
            class="can-deal"
            @click.stop.prevent="createDeal"
          >发起交易</button>
          <button
            v-else
            class="mine-btn"
          >查看数据</button>
        </template>
        <button
          v-else
          class="pub-btn"
        >马上入股</button>
      </div>
    </nuxt-link>
  </li>
</template>

<script>
import { Tag } from 'element-ui'

export default {
  name: 'VirtualIdolItem',
  components: {
    'el-tag': Tag
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    sort: {
      type: String,
      required: true
    }
  },
  methods: {
    createDeal() {
      this.$emit('create', this.item)
    }
  }
}
</script>
