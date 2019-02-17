<style lang="scss">
.role-show {
  .profile {
    margin-top: $container-padding;

    .avatar {
      float: left;
      margin-right: 10px;
      margin-bottom: 5px;
      border: 1px solid $color-gray-normal;
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
      border: 1px solid $color-gray-normal;
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

  .bangumi {
    padding-top: 15px;
    padding-bottom: 15px;

    .summary {
      font-size: 12px;
      color: #666;
      @include twoline(13px);
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
  <div 
    id="role-show" 
    class="role-show">
    <div class="container">
      <div v-if="role.has_market_price_draft">
        <br>
        <p class="sub-title">重要提醒</p>
        <el-alert
          v-if="role.market_price_draft_voted"
          :closable="false"
          :description="`你已投「${role.market_price_draft_voted > 0 ? '同意' : '反对'}」票`"
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
        <h3 class="sub-title">偶像信息</h3>
        <div class="clearfix">
          <v-img
            :src="role.avatar"
            :share="true"
            :width="75"
            :height="75"
            class="avatar"
          />
          <div class="info">
            <h1
              class="name"
              v-text="role.name"/>
            <star-idol-btn
              :idol="role"
              @success="handleStarCallback"
            />
          </div>
        </div>
        <div @click="collapsed = !collapsed">
          <p
            v-if="collapsed"
            class="summary collapsed"
          >
            <strong>简介：</strong>{{ role.intro.substr(0, 30) }}...
            <button>全文</button>
          </p>
          <div
            v-else
            class="summary"
          >
            <strong>简介：</strong>
            <p v-html="computedHtmlIntro"/>
            <button>收起</button>
          </div>
        </div>
      </div>
      <div class="stock-info">
        <h3 class="sub-title">股市行情</h3>
        <idol-stock-chart :idol="role"/>
      </div>
      <div v-if="role.boss">
        <h3
          class="sub-title"
          style="margin-top:15px"
        >大股东</h3>
        <div class="boss">
          <nuxt-link :to="$alias.user(role.boss.zone)">
            <img :src="$resize(role.boss.avatar, { width: 30, height: 30 })">
            <span>{{ role.boss.nickname }}</span>
          </nuxt-link>
          <span>：{{ role.lover_words || 'TA还什么都没说' }}</span>
        </div>
      </div>
      <div>
        <h3 class="sub-title">应援群</h3>
        <div class="qq-group">
          <p><strong>QQ群号：</strong>{{ role.qq_group || '106402736' }}</p>
        </div>
      </div>
      <div class="hr"/>
      <div class="bangumi">
        <bangumi-panel
          :id="bangumi.id"
          :avatar="bangumi.avatar"
          :name="bangumi.name"
        >
          <p 
            class="summary" 
            v-text="bangumi.summary"/>
        </bangumi-panel>
      </div>
    </div>
    <div class="hr"/>
    <div class="container tab-wrap">
      <tab-container
        :headers="tabs"
        @change="handleTabSwitch"
      >
        <template slot="0">
          <v-lazy>
            <comment-main
              :id="id"
              :master-id="1"
              type="role"
            />
          </v-lazy>
        </template>
        <template slot="1">
          <idol-owner-list
            :id="id"
            :star="role.star_count"
          />
        </template>
        <template slot="2">
          <idol-market-price-draft
            :is-boss="isBoss"
            :idol="role"
          />
        </template>
        <template slot="3">
          <div class="rules">
            <p>目前还没有公司章程，以下为功能简介：</p>
            <ul>
              <li>新注册的公司，只要达到20人参股，就会自动上市</li>
              <!--
              <li>新注册的公司，若未能在指定时间期限内上市，则会倒闭，所有投资人的将无法获得收益</li>
              -->
              <li>上市之后，占股最多的人将成为最大的股东</li>
              <li>最大的股东并非实时变更，会在一定周期内自动变更为持股最多的人</li>
              <li>最大的股东可以发起「增发提案」来修改股价</li>
              <li>最大的股东可以留下自己的个人寄语，第一个大股东可以创建应援群</li>
              <li>上市后所有的持股人可以在「交易所」进行股权交易，以赚取虚拟币</li>
              <li>在未来，会开发出更多的方式，让公司能够健康发展</li>
            </ul>
          </div>
        </template>
        <template slot="4">
          <template v-if="isBoss">
            <el-collapse
              v-model="activeName"
              accordion
            >
              <el-collapse-item name="0">
                <p
                  slot="title"
                  class="title"
                >
                  信息修改
                </p>
                <change-idol-profile :idol="role"/>
              </el-collapse-item>
              <el-collapse-item name="1">
                <p
                  slot="title"
                  class="title"
                >
                  股权变更
                </p>
                <create-change-market-price-draft :idol="role"/>
              </el-collapse-item>
            </el-collapse>
          </template>
          <p v-else>
            <br>
            <br>
            只有大股东可以修改公司股价和发行量
            <br>
            <br>
            <br>
          </p>
        </template>
      </tab-container>
    </div>
    <share-btn :share-data="share_data"/>
  </div>
</template>

<script>
import { getCartoonRoleInfo } from '~/api/cartoonRoleApi'
import CommentMain from '~/components/comments/CommentMain'
import BangumiPanel from '~/components/panel/BangumiPanel'
import ShareBtn from '~/components/common/ShareBtn'
import StarIdolBtn from '~/components/idol/StarIdolBtn'
import TabContainer from '~/components/common/TabContainer'
import IdolOwnerList from '~/components/idol/IdolOwnerList'
import IdolMarketPriceDraft from '~/components/idol/IdolMarketPriceDraft'
import CreateChangeMarketPriceDraft from '~/components/idol/CreateChangeMarketPriceDraft'
import ChangeIdolProfile from '~/components/idol/ChangeIdolProfile'
import IdolStockChart from '~/components/idol/IdolStockChart'
import { Collapse, CollapseItem } from 'element-ui'

export default {
  name: 'RoleShow',
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },
  async asyncData({ app, store, params, error }) {
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
      .catch(error)
  },
  head() {
    return {
      title: this.role.name
    }
  },
  components: {
    CommentMain,
    BangumiPanel,
    ShareBtn,
    StarIdolBtn,
    TabContainer,
    IdolOwnerList,
    IdolMarketPriceDraft,
    CreateChangeMarketPriceDraft,
    ChangeIdolProfile,
    IdolStockChart,
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
      activeName: ''
    }
  },
  computed: {
    computedHtmlIntro() {
      return this.role.intro.replace(/\n/g, '<br>')
    },
    currentUserId() {
      return this.$store.state.login ? this.$store.state.user.id : 0
    },
    tabs() {
      return [
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
          label: '章程'
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
      if (index === 1) {
        this.$store.dispatch('flow/initData', {
          func: 'virtualIdolOwners',
          type: 'seenIds',
          sort: 'biggest',
          id: this.id
        })
      }
      if (index === 2) {
        this.$store.dispatch('flow/initData', {
          func: 'getIdolDraftList',
          type: 'page',
          sort: 'new',
          id: this.id
        })
      }
    }
  }
}
</script>
