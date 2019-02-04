<style lang="scss">
.role-show {
  .profile {
    margin-top: $container-padding;
    min-height: 80px;

    .avatar {
      float: left;
      margin-right: 10px;
      margin-bottom: $container-padding;
    }

    .info {
      overflow: hidden;

      .name {
        font-size: 18px;
        margin-bottom: 5px;
        margin-top: 0;
      }

      .lover {
        height: 26px;
        margin-bottom: 5px;

        .image {
          vertical-align: middle;
          display: inline-block;
        }
      }

      .star {
        @include btn-empty(#000);
      }
    }

    .summary {
      line-height: 20px;
      font-size: 13px;
      margin-bottom: 5px;
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
        text-decoration: underline;
      }
    }

    .coin {
      line-height: 20px;
      font-size: 13px;
      margin-bottom: 5px;
    }
  }

  .bangumi {
    padding-top: $container-padding;

    .summary {
      font-size: 12px;
      color: #666;
      @include twoline(13px);
    }
  }

  .fans-sort-btn {
    float: right;
    font-size: 13px;
    line-height: 40px;
  }

  .tab-card {
    .role-fans {
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

      .avatar {
        display: inline-block;
        vertical-align: middle;
        margin-right: 3px;
      }

      .score {
        float: right;
        margin-top: 9px;
        font-size: 12px;
        color: $color-text-normal;
      }
    }

    .role-comment-wrap {
      padding-left: $container-padding;
      padding-right: $container-padding;

      .hr {
        display: none;
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
        <h3 class="sub-title">角色信息</h3>
        <div>
          <div class="clearfix">
            <v-img
              :src="role.avatar"
              :share="true"
              :width="80"
              class="avatar"
            />
            <div class="info">
              <h1 
                class="name" 
                v-text="role.name"/>
              <div class="lover">
                <template v-if="role.lover">
                  <nuxt-link :to="$alias.user(role.lover.zone)">
                    守护者：
                    <v-img
                      :src="role.lover.avatar"
                      :avatar="true"
                      :width="26"
                      class="image"
                    />
                    {{ role.lover.nickname }}
                  </nuxt-link>
                </template>
              </div>
              <button 
                class="star" 
                @click="handleStarRole">为TA应援</button>
            </div>
          </div>
          <div>
            <h3 class="sub-title">角色简介</h3>
            <p class="summary">
              <strong>介绍：</strong>{{ role.intro }}
            </p>
            <ul class="alias clearfix">
              <strong>别名：</strong>
              <li
                v-for="(name, index) in computeRoleAlias"
                :key="index"
                v-text="name"
              />
            </ul>
            <p 
              v-if="role.star_count" 
              class="coin">
              <strong>粉丝：</strong>共有 {{ role.fans_count }} 个粉丝，收获了 {{ role.star_count }} 个团子
            </p>
          </div>
        </div>
      </div>
      <div class="bangumi">
        <h3 class="sub-title">所属番剧</h3>
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
    <div class="tabs">
      <button
        :class="{ 'active': sort === 'comment' }"
        @click="switchTab('comment')">留言板</button>
      <button 
        :class="{ 'active': sort === 'fans' }" 
        @click="switchTab('fans')">应援团</button>
      <v-popover
        v-if="sort === 'fans'"
        :actions="fansSortActions"
        class-name="fans-sort-btn"
      >
        <span>
          <i class="el-icon-d-caret"/>
          排序
        </span>
      </v-popover>
    </div>
    <div class="tab-card">
      <template v-if="sort === 'fans'">
        <ul class="role-fans container">
          <li
            v-for="(item, index) in fans.list"
            :key="index"
          >
            <nuxt-link :to="$alias.user(item.zone)">
              <v-img
                :src="item.avatar"
                :avatar="true"
                :width="30"
                class="avatar"
              />
              {{ item.nickname }}
              <v-time
                v-if="fetchFansSort === 'new'"
                v-model="item.score"
                class="score"
              />
              <span
                v-else
                class="score"
              >{{ item.score }}个团子</span>
            </nuxt-link>
          </li>
        </ul>
        <more-btn
          :no-more="fans.noMore"
          :length="fans.list.length"
          :loading="loadingRoleFans"
          @fetch="fetchRoleFans(false)"
        />
      </template>
      <div
        v-else-if="sort === 'comment'"
        class="role-comment-wrap"
      >
        <v-lazy>
          <comment-main
            :id="id"
            :master-id="1"
            type="role"
          />
        </v-lazy>
      </div>
    </div>
    <share-btn :share-data="share_data"/>
  </div>
</template>

<script>
import CommentMain from '~/components/comments/CommentMain'
import BangumiPanel from '~/components/panel/BangumiPanel'
import VPopover from '~/components/common/Popover'
import ShareBtn from '~/components/common/ShareBtn'
import { getCartoonRoleInfo, starRoleAction } from '~/api/cartoonRoleApi'

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
        return {
          info: data,
          role: data.data,
          bangumi,
          share_data: data.share_data
        }
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
    VPopover,
    ShareBtn
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      sort: 'comment',
      loadingRoleFans: false,
      loadingRoleImage: false,
      roleImageLoaded: false,
      fetchFansSort: 'new',
      fansSortActions: [
        {
          name: '最多应援',
          method: () => {
            this.fetchFansSort = 'hot'
            this.fetchRoleFans(true)
          }
        },
        {
          name: '最新应援',
          method: () => {
            this.fetchFansSort = 'new'
            this.fetchRoleFans(true)
          }
        }
      ],
      share_data: null
    }
  },
  computed: {
    fans() {
      return this.fetchFansSort === 'new' ? this.latestFans : this.biggestFans
    },
    latestFans() {
      return this.$store.getters['flow/getFlow'](
        'cartoonRoleFans',
        'new',
        this.id
      )
    },
    biggestFans() {
      return this.$store.getters['flow/getFlow'](
        'cartoonRoleFans',
        'hot',
        this.id
      )
    },
    computeRoleAlias() {
      return this.role.alias.split(',')
    }
  },
  methods: {
    switchTab(tab) {
      this.sort = tab
      if (tab === 'fans') {
        this.fetchRoleFans(true)
      }
    },
    async handleStarRole() {
      if (!this.$store.state.login) {
        this.$channel.$emit('sign-in')
        return
      }
      if (!this.$store.state.user.coin) {
        this.$toast.error('团子不足')
        return
      }
      try {
        await starRoleAction(this, {
          id: this.id
        })
        this.role.hasStar++
        this.role.star_count++
        this.$store.commit('USE_COIN')
        this.$toast.info(`+${this.role.hasStar}s`)
      } catch (e) {}
    },
    async fetchRoleFans(init = false) {
      if (this.loadingRoleFans) return
      if (init) {
        this.loadingRoleFans = true
        await this.$store.dispatch('flow/initData', {
          func: 'cartoonRoleFans',
          type: this.fetchFansSort === 'new' ? 'lastId' : 'seenIds',
          sort: this.fetchFansSort,
          id: this.id
        })
        this.loadingRoleFans = false
        return
      }

      this.loadingRoleFans = true
      try {
        this.$store.dispatch('flow/loadMore', {
          func: 'cartoonRoleFans',
          type: this.fetchFansSort === 'new' ? 'lastId' : 'seenIds',
          sort: this.fetchFansSort,
          id: this.id
        })
      } finally {
        this.loadingRoleFans = false
      }
    },
    loadMoreFans() {
      this.$store.dispatch('flow/loadMore', {
        func: 'cartoonRoleFans',
        type: this.fetchFansSort === 'new' ? 'lastId' : 'seenIds',
        sort: this.fetchFansSort,
        id: this.id
      })
    }
  }
}
</script>
