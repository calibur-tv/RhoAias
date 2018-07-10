<style lang="scss">
  #role-show {
    .profile {
      margin-top: $container-padding;
      min-height: 80px;

      .avatar {
        width: 80px;
        height: 80px;
        float: left;
        margin-right: 10px;
        margin-bottom: $container-padding;
      }

      .info {
        overflow: hidden;

        .name {
          font-size: 18px;
          margin-bottom: 5px;
        }

        .lover {
          height: 26px;
          margin-bottom: 5px;

          img {
            vertical-align: middle;
            border: 1px solid $color-gray-normal;
            border-radius: 50%;
            @include avatar(26px);
          }
        }

        .star {
          @include btn-empty(#000)
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
        @include twoline(13px)
      }
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
          vertical-align: middle;
          border: 1px solid $color-gray-normal;
          border-radius: 50%;
          margin-right: 3px;
          @include avatar(30px);
        }

        time {
          float: right;
          margin-top: 9px;
          font-size: 12px;
          color: $color-text-normal;
        }
      }
    }
  }
</style>

<template>
  <div id="role-show">
    <div class="container">
      <div class="profile clearfix">
        <h3 class="sub-title">角色信息</h3>
        <div>
          <div class="clearfix">
            <img class="avatar" :src="$resize(role.avatar, { width: 80 })">
            <div class="info">
              <h1 class="name" v-text="role.name"></h1>
              <div class="lover">
                <template v-if="role.lover">
                  <a :href="$alias.user(role.lover.zone)">
                    守护者：
                    <img :src="$resize(role.lover.avatar, { width: 52 })">
                    {{ role.lover.nickname }}
                  </a>
                </template>
              </div>
              <button @click="handleStarRole" class="star">为TA应援</button>
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
                v-text="name"
                :key="index"
              ></li>
            </ul>
            <p class="coin" v-if="role.star_count">
              <strong>粉丝：</strong>共有 {{ role.fans_count }} 个粉丝，收获了 {{ role.star_count }} 个金币
            </p>
          </div>
        </div>
      </div>
      <div class="bangumi">
        <h3 class="sub-title">所属番剧</h3>
        <v-bangumi-panel
          :id="bangumi.id"
          :avatar="bangumi.avatar"
          :name="bangumi.name"
          :followed="bangumi.followed"
          @follow="handleBangumiFollow"
        >
          <p class="summary" v-text="bangumi.summary"></p>
        </v-bangumi-panel>
      </div>
    </div>
    <div class="tabs">
      <button @click="switchTab('fans')" :class="{ 'active': sort === 'fans' }">应援团</button>
    </div>
    <div class="tab-card">
      <template v-if="sort === 'fans'">
        <ul class="role-fans container">
          <li v-for="item in fans.list">
            <a :href="$alias.user(item.zone)">
              <img class="avatar" :src="$resize(item.avatar, { width: 60 })">
              {{ item.nickname }}
              <v-time v-model="item.score"></v-time>
            </a>
          </li>
        </ul>
        <more-btn
          :no-more="fans.noMore"
          :length="fans.list.length"
          :loading="loadingRoleFans"
          @fetch="fetchRoleFans"
        ></more-btn>
      </template>
      <template v-else-if="sort === 'image'">
        <image-waterfall
          :loading="loadingRoleImage"
          @fetch="getRoleImages"
        ></image-waterfall>
      </template>
    </div>
  </div>
</template>

<script>
  import ImageWaterfall from '~/components/lists/ImageWaterfall'

  export default {
    name: 'role-show',
    async asyncData ({ store, route, ctx }) {
      const id = route.params.id
      await Promise.all([
        store.dispatch('cartoonRole/getRoleInfo', { ctx, id }),
        store.dispatch('cartoonRole/getFansList', {
          ctx,
          bangumiId: 0,
          roleId: id,
          sort: 'new',
          reset: false
        })
      ])
    },
    components: {
      ImageWaterfall
    },
    computed: {
      id () {
        return this.$route.params.id
      },
      info () {
        return this.$store.state.cartoonRole.info
      },
      role () {
        return this.info.data
      },
      bangumi () {
        return this.info.bangumi
      },
      images () {
        return this.info.images
      },
      fans () {
        return this.$store.state.cartoonRole.fans.new
      },
      computeRoleAlias () {
        return this.role.alias.split(',')
      }
    },
    data () {
      return {
        sort: 'fans',
        loadingRoleFans: false,
        loadingRoleImage: false,
        roleImageLoaded: false
      }
    },
    methods: {
      switchTab (tab) {
        this.sort = tab
        if (tab === 'image' && !this.roleImageLoaded) {
          this.getRoleImages(true)
        }
      },
      handleBangumiFollow (result) {
        this.$store.commit('cartoonRole/FOLLOW_ROLE_BANGUMI', { result })
      },
      async handleStarRole () {
        if (!this.$store.state.login) {
          this.$channel.$emit('sign-in')
          return
        }
        if (!this.$store.state.user.coin) {
          this.$toast.error('金币不足')
          return
        }
        try {
          await this.$store.dispatch('cartoonRole/star', {
            bangumiId: this.bangumi.id,
            roleId: this.id,
            ctx: this,
            hasStar: this.role.hasStar
          })
          this.$store.commit('USE_COIN')
          this.$toast.info(`+${this.role.hasStar}s`)
        } catch (e) {
          this.$toast.error(e)
        }
      },
      async fetchRoleFans () {
        if (this.loadingRoleFans) {
          return
        }
        this.loadingRoleFans = true
        try {
          await this.$store.dispatch('cartoonRole/getFansList', {
            ctx: this,
            bangumiId: this.bangumi.id,
            roleId: this.id,
            sort: 'new'
          })
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.loadingRoleFans = false
        }
      },
      async getRoleImages (reset = false) {
        if (this.loadingRoleImage) {
          return
        }
        this.loadingRoleImage = true
        try {
          await this.$store.dispatch('image/getRoleImages', {
            ctx: this,
            id: this.id,
            force: reset
          })
          this.roleImageLoaded = true
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.loadingRoleImage = false
        }
      }
    }
  }
</script>
