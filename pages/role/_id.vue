<style lang="scss">
.role-show {
  .profile {
    margin-top: $container-padding;
    min-height: 80px;

    .avatar {
      float: left;
      margin-right: 10px;
      margin-bottom: $container-padding;
      border: 1px solid $color-gray-normal;
      border-radius: 5px;
    }

    .info {
      position: relative;
      overflow: hidden;
      height: 80px;

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
      margin-bottom: 5px;

      &.collapsed {
        @include twoline(20px);
      }

      button {
        font-size: 13px;
        color: $color-pink-normal;
      }
    }

    .alias {
      line-height: 20px;
      font-size: 13px;
      margin-bottom: 5px;

      strong {
        float: left;
      }

      li {
        float: left;
        margin-right: 5px;
      }
    }

    .coin {
      line-height: 20px;
      font-size: 13px;
      margin-bottom: 5px;
    }

    .boss {
      height: 26px;
      margin-bottom: 10px;

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
    }
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
      <div class="profile clearfix">
        <h3 class="sub-title">偶像信息</h3>
        <div>
          <div class="clearfix">
            <v-img
              :src="role.avatar"
              :share="true"
              :width="80"
              :height="80"
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
          <div>
            <h3 class="sub-title">偶像简介</h3>
            <div @click="collapsed = !collapsed">
              <p
                :class="{ 'collapsed': collapsed }"
                class="summary"
              >
                <strong>介绍：</strong>{{ collapsed ? `${role.intro.substr(0, 30)}...` : role.intro }}
                <button>{{ collapsed ? '全文' : '收起' }}</button>
              </p>
            </div>
            <ul class="alias clearfix">
              <strong>别名：</strong>
              <li
                v-for="(name, index) in computeRoleAlias"
                :key="index"
                v-text="name"
              />
            </ul>
            <div class="coin">
              <p><strong>当前市值：</strong>￥{{ role.company_state ? role.market_price : '未上市' }}</p>
              <p><strong>每股股价：</strong>￥{{ role.stock_price }}</p>
              <p><strong>持股人数：</strong>{{ role.fans_count }}</p>
              <p><strong>已认购股数：</strong>{{ role.star_count }}</p>
              <p><strong>总发行股数：</strong>{{ hasLimited ? role.max_stock_count : '无上限' }}</p>
            </div>
            <div class="coin">
              <p><strong>我持有的股数：</strong>{{ hasBuyStock ? role.has_star : '未入股' }}</p>
            </div>
            <div class="coin">
              <p><strong>注册时间：</strong>{{ role.created_at }}</p>
              <p v-if="role.ipo_at"><strong>上市时间：</strong>{{ role.ipo_at }}</p>
            </div>
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
            </div>
          </div>
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
              <li>上市后所有的持股人可以在「交易所」进行股权交易，以赚取虚拟币</li>
              <li>在未来，会开发出更多的方式，让公司能够健康发展</li>
            </ul>
          </div>
        </template>
        <template slot="4">
          <create-change-market-price-draft
            v-if="isBoss"
            :idol="role"
          />
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
      title: `《${this.bangumi.name}》—— ${this.role.name}`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'calibur.tv，一个兴趣使然的二次元综合网站'
        }
      ]
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
    CreateChangeMarketPriceDraft
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
      collapsed: true
    }
  },
  computed: {
    computeRoleAlias() {
      return this.role.alias.split(',')
    },
    currentUserId() {
      return this.$store.state.login ? this.$store.state.user.id : 0
    },
    hasLimited() {
      return this.role.max_stock_count !== '0.00'
    },
    hasBuyStock() {
      return this.role.has_star !== '0.00'
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
          label: '增发提案'
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
