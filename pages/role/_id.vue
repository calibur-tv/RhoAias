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

    .user-list {
      padding-top: $container-padding;

      li {
        margin-bottom: 10px;
        font-size: 13px;
        position: relative;
        padding-bottom: 10px;

        &:not(:last-child) {
          @include border-bottom(0);
        }
      }

      .user {
        overflow: hidden;
        height: 30px;

        .avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          margin-right: 5px;
          float: left;
        }

        .nickname {
          overflow: hidden;
          line-height: 30px;
          font-size: 12px;
          color: $color-text-normal;
        }
      }

      .score {
        float: right;
        font-size: 12px;
        margin-top: 8px;
        color: $color-text-normal;
      }
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

    .change-stock {
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
          <flow-list
            :id="id"
            func="virtualIdolOwners"
            type="lastId"
            sort="newest"
          >
            <ul
              slot-scope="{ flow }"
              class="user-list"
            >
              <li
                v-for="item in flow"
                :key="item.id"
              >
                <nuxt-link :to="$alias.user(item.zone)">
                  <v-time
                    v-model="item.score"
                    class="score"
                  />
                  <div class="user">
                    <img
                      :src="$resize(item.avatar, { width: 60 })"
                      class="avatar"
                    >
                    <p
                      class="nickname oneline"
                      v-text="item.nickname"
                    />
                  </div>
                </nuxt-link>
              </li>
            </ul>
          </flow-list>
        </template>
        <template slot="2">
          <flow-list
            :id="id"
            func="virtualIdolOwners"
            type="seenIds"
            sort="biggest"
          >
            <ul
              slot-scope="{ flow }"
              class="user-list"
            >
              <li
                v-for="item in flow"
                :key="item.id"
              >
                <nuxt-link :to="$alias.user(item.zone)">
                  <span class="score">持有{{ item.score }}股，占比{{ computedPercent(item.score) }}</span>
                  <div class="user">
                    <img
                      :src="$resize(item.avatar, { width: 60 })"
                      class="avatar"
                    >
                    <p
                      class="nickname oneline"
                      v-text="item.nickname"
                    />
                  </div>
                </nuxt-link>
              </li>
            </ul>
          </flow-list>
        </template>
        <template slot="3">
          <div class="rules">
            <p>目前还没有公司章程，以下为功能简介：</p>
            <ul>
              <li>新注册的公司，只要至少有20人参股，就可以自动上市</li>
              <li>新注册的公司，若未能在指定时间期限内上市，则会倒闭，所有投资人的将无法获得收益</li>
              <li>上市之后，占股最多的人将成为最大的股东</li>
              <li>最大的股东并非实时变更，会在每天夜里重新指定</li>
              <li>最大的股东可以修改偶像的简介，以及修改「每股股价」来提高市值</li>
              <li>之后所有的持股人可以在「交易所」进行股权交易，以赚取虚拟币</li>
              <li>在未来，会开发出更多的方式，让股东可以获得分红</li>
            </ul>
          </div>
        </template>
        <template slot="4">
          <div class="change-stock">
            <template v-if="isBoss">
              <p>发行规则：</p>
              <ul>
                <li>每周只能修改一次</li>
                <li>每次增发的股份，不能小于 {{ minLevel }} 股</li>
                <li>现阶段，不支持以每股价格低于 1.00 或高于 10.00 的价格进行增发</li>
                <li>若已售出股份小于 4000，则每次发行的股值不能低于总市值的 25%，否则发行的股值不能低于总市值的 10%</li>
              </ul>
              <p>设置价格：</p>
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
            </template>
            <p v-else>只有大股东可以修改公司股价和发行量</p>
          </div>
        </template>
      </tab-container>
    </div>
    <share-btn :share-data="share_data"/>
  </div>
</template>

<script>
import CommentMain from '~/components/comments/CommentMain'
import BangumiPanel from '~/components/panel/BangumiPanel'
import ShareBtn from '~/components/common/ShareBtn'
import StarIdolBtn from '~/components/idol/StarIdolBtn'
import TabContainer from '~/components/common/TabContainer'
import FlowList from '~/components/flow/FlowList'
import { getCartoonRoleInfo, changeStockPrice } from '~/api/cartoonRoleApi'
import { InputNumber } from 'element-ui'

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
    FlowList,
    InputNumber
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
      minLevel: 500,
      stock_form: {
        submitting: false,
        new_price: 0,
        add_stock_count: 0
      }
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
          label: '股东'
        },
        {
          label: '章程'
        },
        {
          label: '增发'
        }
      ]
    },
    isBoss() {
      return this.role.boss ? this.role.boss.id === this.currentUserId : false
    },
    maxStockCount() {
      return +this.role.max_stock_count + this.stock_form.add_stock_count
    },
    minAddPrice() {
      let result
      if (this.role.star_count < 4000) {
        result = this.role.market_price * 0.25
      } else {
        result = this.role.market_price * 0.1
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
      return parseFloat(+this.role.market_price + +this.curAddPrice).toFixed(2)
    }
  },
  methods: {
    computedPercent(score) {
      return `${parseFloat((score / this.role.star_count) * 100).toFixed(2)}%`
    },
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
          type: 'lastId',
          sort: 'newest',
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
    },
    submitAddStock() {
      if (this.stock_form.submitting) {
        return
      }
      this.$confirm('一周只能修改一次，确认增发吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.stock_form.submitting = true
          await changeStockPrice(this, {
            idol_id: this.id,
            max_stock_count: this.maxStockCount,
            stock_price: this.stock_form.new_price
          })
          this.$toast.success('修改成功')
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        })
        .catch(() => {
          this.stock_form.submitting = false
        })
    }
  }
}
</script>
