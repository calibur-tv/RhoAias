<style lang="scss">
#role-show {
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
          @extend %avatar;
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
        @extend %avatar;
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
  <div id="role-show">
    <div class="container">
      <div class="profile clearfix">
        <h3 class="sub-title">角色信息</h3>
        <div>
          <div class="clearfix">
            <v-img
              :src="role.avatar"
              size="80"
              class="avatar"
            />
            <div class="info">
              <h1 
                class="name" 
                v-text="role.name"/>
              <div class="lover">
                <template v-if="role.lover">
                  <a :href="$alias.user(role.lover.zone)">
                    守护者：
                    <v-img
                      :src="role.lover.avatar"
                      size="26"
                      class="image"
                    />
                    {{ role.lover.nickname }}
                  </a>
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
          <p 
            class="summary" 
            v-text="bangumi.summary"/>
        </v-bangumi-panel>
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
          <i class="iconfont el-icon-d-caret"/>
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
            <a :href="$alias.user(item.zone)">
              <v-img
                :src="item.avatar"
                size="30"
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
              >{{ item.score }}个金币</span>
            </a>
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
        <comment-main
          :id="id"
          :master-id="1"
          type="role"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CommentMain from "~/components/comments/CommentMain";

export default {
  name: "RoleShow",
  async asyncData({ store, route, ctx }) {
    const id = route.params.id;
    await Promise.all([
      store.dispatch("cartoonRole/getRoleInfo", { ctx, id }),
      store.dispatch("comment/getMainComments", {
        ctx,
        id,
        type: "role",
        seeReplyId: route.query["comment-id"]
      })
    ]);
  },
  components: {
    CommentMain
  },
  data() {
    return {
      sort: "comment",
      loadingRoleFans: false,
      loadingRoleImage: false,
      roleImageLoaded: false,
      fetchFansSort: "new",
      fansSortActions: [
        {
          name: "最多应援",
          method: () => {
            this.fetchFansSort = "hot";
            this.fetchRoleFans(true);
          }
        },
        {
          name: "最新应援",
          method: () => {
            this.fetchFansSort = "new";
            this.fetchRoleFans(true);
          }
        }
      ]
    };
  },
  computed: {
    id() {
      return +this.$route.params.id;
    },
    info() {
      return this.$store.state.cartoonRole.info;
    },
    role() {
      return this.info.data;
    },
    bangumi() {
      return this.info.bangumi;
    },
    images() {
      return this.info.images;
    },
    fans() {
      return this.$store.state.cartoonRole.fans[this.fetchFansSort];
    },
    computeRoleAlias() {
      return this.role.alias.split(",");
    }
  },
  methods: {
    switchTab(tab) {
      this.sort = tab;
      if (tab === "image") {
        this.getRoleImages(true);
      } else if (tab === "fans") {
        this.fetchRoleFans(true);
      }
    },
    handleBangumiFollow(result) {
      this.$store.commit("cartoonRole/FOLLOW_ROLE_BANGUMI", { result });
    },
    async handleStarRole() {
      if (!this.$store.state.login) {
        this.$channel.$emit("sign-in");
        return;
      }
      if (!this.$store.state.user.coin) {
        this.$toast.error("金币不足");
        return;
      }
      try {
        await this.$store.dispatch("cartoonRole/star", {
          bangumiId: this.bangumi.id,
          roleId: this.id,
          ctx: this,
          hasStar: this.role.hasStar
        });
        this.$store.commit("USE_COIN");
        this.$toast.info(`+${this.role.hasStar}s`);
      } catch (e) {
        this.$toast.error(e);
      }
    },
    async fetchRoleFans(init = false) {
      if (init && this.fans.length) {
        return;
      }
      if (this.loadingRoleFans) {
        return;
      }
      this.loadingRoleFans = true;
      try {
        await this.$store.dispatch("cartoonRole/getFansList", {
          ctx: this,
          bangumiId: this.bangumi.id,
          roleId: this.id,
          sort: this.fetchFansSort
        });
      } catch (e) {
        this.$toast.error(e);
      } finally {
        this.loadingRoleFans = false;
      }
    },
    async getRoleImages(init = false) {
      if (init && this.roleImageLoaded) {
        return;
      }
      if (this.loadingRoleImage) {
        return;
      }
      this.loadingRoleImage = true;
      try {
        await this.$store.dispatch("image/getRoleImages", {
          ctx: this,
          id: this.id,
          force: init
        });
        this.roleImageLoaded = true;
      } catch (e) {
        this.$toast.error(e);
      } finally {
        this.loadingRoleImage = false;
      }
    }
  }
};
</script>
