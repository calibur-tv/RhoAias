<style lang="scss">
.role-show {
  .info-wrap {
    .el-collapse-item__content {
      padding-bottom: 0;
    }

    .el-collapse-item {
      &:last-child {
        .el-collapse-item__header,
        .el-collapse-item__wrap {
          border-bottom-width: 0;
        }
      }
    }

    .notice {
      margin-bottom: 15px;
    }

    .profile {
      .avatar {
        float: left;
        margin-right: 10px;
        margin-bottom: 5px;
        border: 1px solid $color-avatar-border;
        border-radius: 5px;
      }

      .info {
        position: relative;
        overflow: hidden;
        height: 75px;

        .name {
          font-size: 18px;
          margin-bottom: 5px;
          margin-top: 0;
          @include twoline(20px);
        }

        .star-idol-btn {
          position: absolute;
          bottom: 7px;
          right: 3px;
        }
      }

      .summary {
        line-height: 20px;
        font-size: 13px;
        margin-bottom: 8px;

        &.collapsed {
          @include twoline(20px);
        }

        button {
          font-size: 13px;
          color: $color-pink-normal;
        }
      }
    }

    .boss {
      margin-bottom: 15px;

      img,
      span {
        vertical-align: middle;
      }

      img {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        border: 1px solid $color-avatar-border;
      }

      span {
        font-size: 13px;
      }
    }

    .qq-group {
      line-height: 20px;
      font-size: 13px;
      margin-bottom: 10px;
    }
  }

  .tab-wrap {
    .hr {
      display: none;
    }

    .rules {
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
    }
  }
}
</style>

<template>
  <div id="role-show" class="role-show">
    <div class="container info-wrap">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="偶像信息" name="1">
          <div v-if="role.has_market_price_draft" class="notice">
            <el-alert
              v-if="role.market_price_draft_voted"
              :closable="false"
              :description="
                `你已投「${
                  role.market_price_draft_voted > 0 ? '同意' : '反对'
                }」票`
              "
              title="正在召开股东大会"
              type="info"
            />
            <el-alert
              v-else
              :closable="false"
              title="正在召开股东大会"
              type="warning"
              description="股东大会召开中，请全体股东到本页面「大事记」一栏进行会议投票"
            />
          </div>
          <div class="profile">
            <div class="clearfix">
              <v-img
                :src="role.avatar"
                width="75"
                height="75"
                class="avatar"
              />
              <div class="info">
                <h1 class="name" v-text="role.name" />
                <StarIdolBtn :idol="role" @success="handleStarCallback" />
              </div>
            </div>
            <div @click="collapsed = !collapsed">
              <p v-if="collapsed" class="summary collapsed">
                <strong>简介：</strong>{{ role.intro.substr(0, 30) }}...
                <button>全文</button>
              </p>
              <div v-else class="summary">
                <strong>简介：</strong>
                <p v-html="computedHtmlIntro" />
                <button>收起</button>
              </div>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="股市详情" name="2">
          <IdolStockTable :idol="role" />
          <IdolStockChart :source="role.chart" :idol-id="id" />
        </el-collapse-item>
        <el-collapse-item title="组织信息" name="3">
          <div v-if="role.boss">
            <h3 class="sub-title">
              大股东
            </h3>
            <div class="boss">
              <nuxt-link :to="$alias.user(role.boss.zone)">
                <img
                  :src="$resize(role.boss.avatar, { width: 30, height: 30 })"
                >
                <span>{{ role.boss.nickname }}</span>
              </nuxt-link>
              <span>：{{ role.lover_words || 'TA还什么都没说' }}</span>
            </div>
          </div>
          <div v-if="role.manager">
            <h3 class="sub-title">
              经纪人
            </h3>
            <div class="boss">
              <nuxt-link :to="$alias.user(role.manager.zone)">
                <img
                  :src="$resize(role.manager.avatar, { width: 30, height: 30 })"
                >
                <span>{{ role.manager.nickname }}</span>
              </nuxt-link>
            </div>
          </div>
          <div v-if="role.company_state">
            <h3 class="sub-title">
              可支配资产
            </h3>
            <div class="boss">
              <span>￥{{ computedIdolMoney }}</span>
            </div>
          </div>
          <div>
            <h3 class="sub-title">
              应援群
            </h3>
            <div class="qq-group">
              <p><strong>QQ群号：</strong>{{ role.qq_group || '106402736' }}</p>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="hr" />
    <div class="container">
      <BangumiPanel :bangumi="bangumi" />
    </div>
    <div class="hr" />
    <div class="container tab-wrap">
      <VueLayoutTab :headers="tabs" :default-index="1" @change="handleTabSwitch">
        <template slot="0">
          <IdolProductArea :idol-id="id" :state="role.company_state" />
        </template>
        <template slot="1">
          <v-lazy>
            <CommentMain :id="id" :master-id="1" type="role" />
          </v-lazy>
        </template>
        <template slot="2">
          <IdolOwnerList :id="id" :star="role.star_count" />
        </template>
        <template slot="3">
          <IdolTimeline :is-boss="isBoss" :idol="role" />
        </template>
        <template slot="4">
          <IdolProductOrderList :idol-id="id" />
        </template>
        <template slot="5">
          <IdolSetting :idol="role" />
        </template>
      </VueLayoutTab>
    </div>
    <ShareBtn :share-data="share_data" />
  </div>
</template>

<script>
import { getCartoonRoleInfo } from '~/api/cartoonRoleApi'
import CommentMain from '~/components/comments/CommentMain'
import BangumiPanel from '~/components/panel/BangumiPanel'
import ShareBtn from '~/components/common/ShareBtn'
import StarIdolBtn from '~/components/idol/StarIdolBtn'
import IdolOwnerList from '~/components/idol/IdolOwnerList'
import IdolTimeline from '~/components/idol/IdolTimeline'
import IdolStockTable from '~/components/idol/IdolStockTable'
import IdolStockChart from '~/components/idol/IdolStockChart'
import IdolSetting from '~/components/idol/IdolSetting'
import { Collapse, CollapseItem } from 'element-ui'
import IdolProductArea from '~/components/idol/IdolProductArea'
import IdolProductOrderList from '~/components/idol/IdolProductOrderList'
import VueLayoutTab from 'vue-layout-tab'

export default {
  name: 'RoleShow',
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },
  components: {
    CommentMain,
    BangumiPanel,
    ShareBtn,
    StarIdolBtn,
    VueLayoutTab,
    IdolOwnerList,
    IdolTimeline,
    IdolStockTable,
    IdolStockChart,
    IdolProductArea,
    IdolSetting,
    IdolProductOrderList,
    'el-collapse': Collapse,
    'el-collapse-item': CollapseItem
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      role: null,
      bangumi: null,
      share_data: null,
      collapsed: true,
      activeNames: ['1', '2', '3']
    }
  },
  computed: {
    computedHtmlIntro() {
      return this.role.intro.replace(/\n/g, '<br>')
    },
    computedIdolMoney() {
      const market_price = +this.role.market_price
      const star_count = +this.role.star_count
      const total_income = +this.role.total_income
      const total_pay = +this.role.total_pay
      return parseFloat(
        market_price - star_count + total_income - total_pay
      ).toFixed(2)
    },
    currentUserId() {
      return this.$store.state.login ? this.$store.state.user.id : 0
    },
    tabs() {
      return [
        {
          label: '产品区'
        },
        {
          label: '留言板'
        },
        {
          label: '投资人'
        },
        {
          label: '大事记'
        },
        {
          label: '采购表'
        },
        {
          label: '变更'
        }
      ]
    },
    isBoss() {
      return this.role.boss ? this.role.boss.id === this.currentUserId : false
    }
  },
  asyncData({ app, store, params, error }) {
    const { id } = params
    return getCartoonRoleInfo(app, { id })
      .then(data => {
        const { bangumi } = data
        store.commit('social/SET_STATE', {
          type: 'bangumi',
          id: bangumi.id,
          data: {
            follow: bangumi.followed
          }
        })
        return { ...data }
      })
      .catch(e => {
        error({
          statusCode: e.statusCode,
          message: e.message
        })
      })
  },
  head() {
    return {
      title: this.role.name,
      script: [
        {
          hid: 'share-data',
          innerHTML: JSON.stringify(this.share_data),
          type: 'application/json'
        }
      ]
    }
  },
  methods: {
    handleStarCallback({ count, amount }) {
      if (!parseFloat(this.role.has_star)) {
        this.role.fans_count++
        if (this.role.fans_count === 20) {
          this.role.company_state = 1
        }
      }
      if (this.role.boss && this.currentUserId === this.role.boss.id) {
        this.role.boss.score += count
      }
      this.role.market_price = parseFloat(
        parseFloat(this.role.market_price) + amount
      ).toFixed(2)
      this.role.has_star = parseFloat(
        parseFloat(this.role.has_star) + count
      ).toFixed(2)
      this.role.star_count = parseFloat(
        parseFloat(this.role.star_count) + count
      ).toFixed(2)
      this.$toast.success(`当前持股：${this.role.has_star}`)
    },
    handleTabSwitch(index) {
      if (index === 0) {
        this.$store.dispatch('flow/initData', {
          func: 'getIdolProducts',
          type: 'lastId',
          sort: 'news',
          id: this.id
        })
      }
      if (index === 2) {
        this.$store.dispatch('flow/initData', {
          func: 'virtualIdolOwners',
          type: 'seenIds',
          sort: 'biggest',
          id: this.id
        })
      }
      if (index === 3) {
        this.$store.dispatch('flow/initData', {
          func: 'getIdolDraftList',
          type: 'page',
          sort: 'new',
          id: this.id
        })
      }
      if (index === 4) {
        this.$store.dispatch('flow/initData', {
          func: 'getIdolProductOrders',
          type: 'page',
          sort: 'news',
          id: this.id
        })
      }
    }
  }
}
</script>
