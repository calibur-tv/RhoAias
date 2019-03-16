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
      border-radius: 5px;
      border: 1px solid $color-avatar-border;
      float: left;
      margin-right: 7px;
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
    padding: 15px;
    font-size: 14px;
    line-height: 20px;
    color: #000;

    .trend-placeholder {
      height: 42px;

      p {
        line-height: 42px;
        font-size: 12px;
        text-align: center;
        color: #8e8e93;
      }
    }

    .price,
    .owners {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      span {
        color: #8e8e93;
      }

      strong {
        font-size: 20px;
        font-weight: normal;
      }

      img {
        width: 20px;
        height: 20px;
        border-radius: 50%;
      }
    }

    .owners {
      margin-bottom: 6px;
      margin-top: -8px;

      .boss {
        z-index: 2;
      }

      .manager {
        z-index: 1;
        margin-right: -12px;
      }
    }

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
        <div class="info">
          <p class="name oneline" v-text="item.name" />
          <div class="meta">
            ￥{{ item.stock_price }}/股，{{ item.fans_count }}人持股，已认购{{
              item.star_count
            }}股
          </div>
        </div>
      </div>
      <div class="body">
        <p class="price">
          <span>总市值:</span>
          <strong>{{
            item.company_state ? `￥${item.market_price}` : '未上市'
          }}</strong>
        </p>
        <p v-if="item.boss" class="owners">
          <span>负责人：</span>
          <span>
            <img
              v-if="item.manager"
              :src="$resize(item.manager.avatar, { width: 50, height: 50 })"
              class="manager"
            >
            <img
              class="boss"
              :src="$resize(item.boss.avatar, { width: 50, height: 50 })"
            >
          </span>
        </p>
        <div class="trend-placeholder">
          <no-ssr v-if="trendData.length">
            <v-trend
              :data="trendData"
              :gradient="['#ffafc9', '#ff8eb3', '#f25d8e']"
              :auto-draw-duration="400"
              :height="42"
              :padding="0"
              auto-draw
              smooth
            />
          </no-ssr>
          <p v-else>
            暂无数据
          </p>
        </div>
        <div v-if="sort === 'mine'" class="badges">
          <el-tag v-if="item.is_locked" size="mini" type="danger">
            已停牌
          </el-tag>
          <el-tag v-else size="mini" type="success">
            挂牌中
          </el-tag>
          <el-tag size="mini" type="info">
            {{ item.company_state ? '已上市' : '未上市' }}
          </el-tag>
        </div>
      </div>
      <div class="footer">
        <span v-if="sort === 'mine'">
          持有：{{ item.has_star }}股，占比 {{ computedPercent }}
        </span>
        <template v-else>
          <span
            v-if="item.ipo_at"
          >上市时间：{{ item.ipo_at.split(' ')[0] }}</span>
          <span v-else>注册时间：{{ item.created_at.split(' ')[0] }}</span>
        </template>
        <template v-if="sort === 'mine'">
          <button
            v-if="item.company_state"
            class="can-deal"
            @click.stop.prevent="createDeal"
          >
            发起交易
          </button>
          <button v-else class="mine-btn">
            查看数据
          </button>
        </template>
        <button v-else class="pub-btn">
          马上入股
        </button>
      </div>
    </nuxt-link>
  </li>
</template>

<script>
import { Tag } from 'element-ui'
import Trend from 'vuetrend'

export default {
  name: 'VirtualIdolItem',
  components: {
    'el-tag': Tag,
    'v-trend': Trend
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
  computed: {
    trendData() {
      return this.item.market_trend.map(_ => +_.value).reverse()
    },
    computedPercent() {
      return `${parseFloat(
        (this.item.has_star / this.item.star_count) * 100
      ).toFixed(2)}%`
    }
  },
  methods: {
    createDeal() {
      this.$emit('create', this.item)
    }
  }
}
</script>
