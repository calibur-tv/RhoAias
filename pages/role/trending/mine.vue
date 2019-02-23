<style lang="scss">
#role-trending-mine {
  header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 37px;
    margin-top: 8px;
  }

  .align-center {
    text-align: center;
    margin-top: 15px;

    img {
      height: 175px;
      width: auto;
    }

    button {
      margin: 10px auto 20px;
      width: 150px;
    }

    p {
      font-size: 14px;
      margin-top: 10px;
      color: rgb(142, 142, 147);
    }
  }
}

.create-idol-deal-drawer {
  .intro {
    color: rgb(142, 142, 147);
    margin-top: 10px;
    margin-bottom: 5px;
  }

  p {
    font-size: 14px;
    line-height: 22px;
  }

  .tips {
    color: rgb(142, 142, 147);
    font-size: 12px;
    margin-bottom: 20px;
    margin-top: 10px;
  }
}
</style>

<template>
  <div id="role-trending-mine">
    <header>
      <el-radio-group v-model="selected" size="mini" @change="handleTabSwitch">
        <el-radio-button
          v-for="(item, index) in options"
          :key="index"
          :label="item"
        />
      </el-radio-group>
    </header>
    <flow-list
      v-show="selected === '我的公司'"
      :id="userId"
      func="virtualIdolList"
      type="seenIds"
      sort="user-activity-1"
    >
      <ul slot-scope="{ flow }">
        <virtual-idol-item
          v-for="item in flow"
          :key="item.id"
          :item="item"
          sort="mine"
          @create="createDeal"
        />
      </ul>
      <div slot="nothing" class="align-center">
        <img src="~assets/img/no-content.png" />
        <nuxt-link to="/role/trending/newbie">
          <el-button type="primary" size="mini" round>
            查看融资中的公司
          </el-button>
        </nuxt-link>
      </div>
    </flow-list>
    <flow-list
      v-show="selected === '我的交易'"
      func="myVirtualIdolDeals"
      type="page"
      sort="mine"
    >
      <ul slot-scope="{ flow }">
        <deal-idol-item
          v-for="item in flow"
          :key="item.id"
          :item="item"
          @delete="deleteDeal"
        />
      </ul>
      <div slot="nothing" class="align-center">
        <img src="~assets/img/no-content.png" />
        <p>还没有发起过交易</p>
      </div>
    </flow-list>
    <flow-list
      v-show="selected === '我的采购'"
      func="getUserProductOrders"
      type="page"
      sort="news"
    >
      <ul slot-scope="{ flow }">
        <idol-product-order-item
          v-for="(item, index) in flow"
          :key="index"
          :item="item"
        />
      </ul>
    </flow-list>
    <v-drawer
      v-model="showCreateDealDrawer"
      from="bottom"
      size="70%"
      header-text="发起交易"
      submit-text="提交"
      @submit="submitDeal"
    >
      <div v-if="idol && deal" class="create-idol-deal-drawer container">
        <p class="intro">
          交易建议：
        </p>
        <p v-if="deal.is_locked">
          当前公开发售的股份已停牌，可高于市场价格出售
        </p>
        <p v-else>
          当前仍有股份在公开发售，应该低于公开价格发售
        </p>
        <p>
          最终交易的总价值不得低于 0.01 个虚拟币，当前市场价：<strong>{{
            idol.stock_price
          }}</strong
          >/股
        </p>
        <p v-if="loaded">
          {{
            deal.id
              ? '检测到当前有正在出售的交易，可对其进行修改'
              : '当前未有正在进行的交易，可新建一个交易'
          }}
        </p>
        <p class="intro">
          出售份额：
        </p>
        <el-input-number
          v-model="deal.product_count"
          :min="0.01"
          :max="has_star"
          :step="0.01"
        />
        <p class="intro">
          出售价格：
        </p>
        <el-input-number
          v-model="deal.product_price"
          :min="0.01"
          :max="10"
          :step="0.01"
        />
        <p class="tips">
          预计收益：{{ canGetMoney }}（精度为小数点后两位，超出的不计）
        </p>
      </div>
    </v-drawer>
  </div>
</template>

<script>
import serverAuth from '~/mixins/serverAuth'
import FlowList from '~/components/flow/FlowList'
import DealIdolItem from '~/components/idol/DealIdolItem'
import VirtualIdolItem from '~/components/idol/VirtualIdolItem'
import {
  deleteCartoonRoleDeal,
  getCartoonRoleDeal,
  createCartoonRoleDeal
} from '~/api/cartoonRoleApi'
import { InputNumber } from 'element-ui'
import IdolProductOrderItem from '~/components/idol/IdolProductOrderItem'

export default {
  name: 'RoleTrendingMine',
  components: {
    FlowList,
    DealIdolItem,
    VirtualIdolItem,
    IdolProductOrderItem,
    'el-input-number': InputNumber
  },
  mixins: [serverAuth],
  head: {
    title: '我的股市'
  },
  data() {
    return {
      selected: '我的公司',
      options: ['我的公司', '我的交易', '我的采购'],
      submitting: false,
      deal: {
        id: 0,
        idol_id: 0,
        product_count: 0,
        product_price: 0
      },
      idol: null,
      loaded: false,
      has_star: 0,
      showCreateDealDrawer: false
    }
  },
  computed: {
    userId() {
      return this.$store.state.user.id
    },
    canGetMoney() {
      return parseFloat(
        this.deal.product_count * this.deal.product_price
      ).toFixed(2)
    }
  },
  mounted() {
    this.getMyIdols()
  },
  methods: {
    getMyIdols() {
      this.$store.dispatch('flow/initData', {
        func: 'virtualIdolList',
        type: 'seenIds',
        sort: 'user-activity-1',
        id: this.userId
      })
    },
    getMyDeals() {
      this.$store.dispatch('flow/initData', {
        func: 'myVirtualIdolDeals',
        type: 'page',
        sort: 'mine'
      })
    },
    getMyOrderRequest() {
      this.$store.dispatch('flow/initData', {
        func: 'getUserProductOrders',
        type: 'page',
        sort: 'news'
      })
    },
    handleTabSwitch(label) {
      if (label === '我的公司') {
        this.getMyIdols()
      }
      if (label === '我的交易') {
        this.getMyDeals()
      }
      if (label === '我的采购') {
        this.getMyOrderRequest()
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
    },
    async getCanExchangeCount() {
      const { deal, has_star } = await getCartoonRoleDeal(this, {
        id: this.idol.id
      })
      if (deal) {
        // 去掉已售出的份额
        deal['product_count'] = deal['last_count']
        Object.keys(this.deal).forEach(key => {
          this.deal[key] = deal[key]
        })
      }
      this.has_star = has_star
      this.loaded = true
    },
    createDeal(idol) {
      this.idol = idol
      this.deal.idol_id = idol.id
      this.getCanExchangeCount()
      this.showCreateDealDrawer = true
    },
    async submitDeal() {
      if (this.canGetMoney < 0.01) {
        this.$toast.error('最低收益不能小于 0.01')
        return
      }
      if (this.submitting) {
        return
      }
      this.submitting = true
      try {
        await createCartoonRoleDeal(this, this.deal)
        this.$toast.success(
          this.deal.id
            ? '交易修改成功，可到交易所查看'
            : '交易创建成功，可到交易所查看'
        )
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>
