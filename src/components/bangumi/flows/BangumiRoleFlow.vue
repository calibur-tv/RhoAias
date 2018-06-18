<style lang="scss">
  #bangumi-role-flow {
    .roles {
      li {
        position: relative;
        padding-bottom: 15px;
        margin-top: 15px;

        &:not(:last-child) {
          @include border-bottom();
        }

        .avatar {
          width: 100px;
          height: 100px;
          display: block;
          float: left;
          overflow: hidden;
          border-radius: 5px;
          margin-right: 10px;
          border: 1px solid $color-gray-normal;

          img {
            width: 100%;
            height: auto;
          }
        }

        .summary {
          overflow: hidden;

          .role {
            display: block;
            font-size: 14px;
            line-height: 20px;
            height: 60px;
            overflow: hidden;

            .name {
              font-weight: bold;
            }

            .intro {
              color: #000;
            }
          }

          .star {
            float: right;
            margin-top: 14px;
            @include btn-empty(#000)
          }
        }

        .footer {
          margin-top: 10px;
          height: 30px;
          line-height: 30px;
          vertical-align: middle;
          color: $color-text-normal;
          text-align: right;

          img {
            width: 20px;
            height: 20px;
            border-radius: 15px;
            vertical-align: middle;
            border: 1px solid $color-gray-normal;
            margin-left: 5px;
            margin-top: -3px;
          }

          a {
            font-size: 12px;
            color: $color-text-normal;
          }

          span {
            margin-left: 10px;
            font-size: 12px;
            margin-right: 2px;
          }
        }
      }
    }

    .role-detail-drawer {
      .info {
        margin-bottom: 20px;
        text-align: center;

        .avatar {
          position: relative;
          margin: 0 auto 15px;
          @include avatar(80px);
          @include border($color-gray-normal, 50%);
        }

        .intro {
          padding: 0 50px;
          font-size: 13px;
        }

        .star {
          margin-top: 10px;
          @include btn-empty(#000)
        }

        .stats {
          font-size: 13px;
          color: $color-text-light;
          margin-top: 10px;

          span {
            margin: 0 5px;
          }
        }
      }

      .lover {
        .sub-title {
          margin-top: 10px;
        }

        .lover-user {
          margin-bottom: 10px;
        }
      }

      .lover-user {
        display: block;

        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid $color-gray-normal;
          margin-right: 10px;
          vertical-align: middle;
        }
      }

      #role-fans-list {
        .lover-user {
          padding: 10px 0;
          position: relative;
          @include border-bottom();

          .score {
            float: right;
            font-size: 13px;
            color: $color-text-light;
            margin-top: 13px;
          }
        }
      }

      .total-limit {
        background-color: #f5f5f5;
        text-align: center;
        font-size: 12px;
        color: #999;
        padding-top: 15px;
      }
    }
  }
</style>

<template>
  <div id="bangumi-role-flow">
    <ul class="roles container" v-if="roles.list.length">
      <li v-for="item in roles.list">
        <div class="clearfix">
          <div class="avatar" @click="showRoleDetail(item)">
            <v-img :src="item.avatar" width="90" height="90"></v-img>
          </div>
          <div class="summary">
            <div class="role" @click="showRoleDetail(item)">
              <span class="name" v-text="item.name"></span>
              <span class="intro">：{{ item.intro }}</span>
            </div>
            <button @click="handleStarRole(item)" class="star">为TA应援</button>
          </div>
        </div>
        <div class="footer" v-if="item.fans_count">
              <span>
                粉丝:
                {{ $utils.shortenNumber(item.fans_count) }}
              </span>
          <span>
                金币:
                {{ $utils.shortenNumber(item.star_count) }}
              </span>
          <span v-if="item.lover">
                守护者：
                <a :href="$alias.user(item.lover.zone)">
                  {{ item.lover.nickname }}
                  <v-img :src="item.lover.avatar" width="20" height="20"></v-img>
                </a>
              </span>
        </div>
      </li>
    </ul>
    <more-btn
      :no-more="roles.noMore"
      :length="roles.list.length"
      :loading="loading"
      @fetch="getRoles"
    >
      <button @click="openFeedbackForRole">求偶像</button>
    </more-btn>
    <v-drawer
      v-model="openRoleDetailDrawer"
      :header-text="currentRole.name"
      from="bottom"
      size="100%"
      class="role-detail-drawer"
      v-if="currentRole"
    >
      <div class="info">
        <div class="avatar">
          <img :src="$resize(currentRole.avatar, { width: 160 })">
        </div>
        <p class="intro" v-text="currentRole.intro"></p>
        <button @click="handleStarRole(currentRole)" class="star">为TA应援</button>
        <div class="stats">
          <span>粉丝数：{{ currentRole.fans_count }}</span>
          <span>金币数：{{ currentRole.star_count }}</span>
        </div>
      </div>
      <div class="lover container" v-if="currentRole.loverId">
        <div class="hr"></div>
        <h3 class="sub-title">守护者：</h3>
        <a class="lover-user" :href="$alias.user(currentRole.lover.zone)">
          <img :src="$resize(currentRole.lover.avatar, { width: 80 })">
          <span v-text="currentRole.lover.nickname"></span>
        </a>
      </div>
      <div class="hr"></div>
      <div class="tabs">
        <button @click="switchFocusRoleTab('new')" :class="{ 'active': focusRoleSort === 'new' }">最近</button>
        <button @click="switchFocusRoleTab('hot')" :class="{ 'active': focusRoleSort === 'hot' }">最多</button>
      </div>
      <ul id="role-fans-list" class="container">
        <li
          v-for="item in currentRoleFans.list"
          :key="item.id"
        >
          <a class="lover-user" :href="$alias.user(item.zone)">
            <img :src="$resize(item.avatar, { width: 80 })">
            <span v-text="item.nickname"></span>
            <v-time class="score" v-if="focusRoleSort === 'new'" v-model="item.score"></v-time>
            <span class="score" v-else>{{ item.score }}个金币</span>
          </a>
        </li>
      </ul>
      <p v-if="currentRoleFans.list.length >= 100" class="total-limit">最多显示100人</p>
      <more-btn
        :no-more="currentRoleFans.noMore"
        :length="currentRoleFans.list.length"
        :loading="loadingRoleFans"
        @fetch="fetchCurrentRoleFans"
      ></more-btn>
    </v-drawer>
  </div>
</template>

<script>
  export default {
    name: 'v-bangumi-role-flow',
    computed: {
      roles () {
        return this.$store.state.bangumi.roles
      },
      info () {
        return this.$store.state.bangumi.info
      },
      currentRoleFans () {
        return this.$store.state.cartoonRole.fans[this.focusRoleSort]
      }
    },
    data () {
      return {
        loading: false,
        currentRole: null,
        openRoleDetailDrawer: false,
        loadingRoleFans: false,
        focusRoleSort: 'new'
      }
    },
    created () {
      if (!this.roles.list.length) {
        this.getRoles()
      }
    },
    methods: {
      openFeedbackForRole () {
        this.$channel.$emit('open-feedback', {
          type: 6,
          desc: `我想要为《${this.info.name}》的 ? 应援`
        })
      },
      showRoleDetail (role) {
        this.currentRole = role
        this.focusRoleSort = 'new'
        this.openRoleDetailDrawer = true
        this.fetchCurrentRoleFans(true)
      },
      switchFocusRoleTab (tab) {
        this.focusRoleSort = tab
        if (this.$store.state.cartoonRole.fans[tab].list.length) {
          return
        }
        this.fetchCurrentRoleFans()
      },
      async getRoles () {
        if (this.loadint) {
          return
        }
        this.loadint = true

        try {
          await this.$store.dispatch('bangumi/getRoles', {
            ctx: this,
            bangumiId: this.info.id
          })
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.loadint = false
        }
      },
      async handleStarRole (role) {
        if (!this.$store.state.login) {
          this.$channel.$emit('sign-in')
          return
        }
        if (!this.$store.state.user.coin) {
          this.$toast.error('金币不足')
          return
        }
        try {
          await this.$store.dispatch('bangumi/starRole', {
            bangumiId: this.info.id,
            roleId: role.id,
            ctx: this,
            hasStar: role.has_star
          })
          this.$store.commit('USE_COIN')
          this.$toast.info(`+${role.has_star}s`)
        } catch (e) {
          this.$toast.error(e)
        }
      },
      async fetchCurrentRoleFans (reset = false) {
        if (this.loadingRoleFans) {
          return
        }
        this.loadingRoleFans = true
        try {
          await this.$store.dispatch('cartoonRole/getFansList', {
            ctx: this,
            bangumiId: this.info.id,
            roleId: this.currentRole.id,
            sort: this.focusRoleSort,
            reset
          })
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.loadingRoleFans = false
        }
      }
    }
  }
</script>
