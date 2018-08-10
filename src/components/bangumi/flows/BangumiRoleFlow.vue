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

        .footer {
          margin-top: 10px;
          height: 30px;
          line-height: 30px;
          vertical-align: middle;
          color: $color-text-normal;

          .image {
            border-radius: 15px;
            vertical-align: middle;
            border: 1px solid $color-gray-normal;
            margin-left: 5px;
            margin-top: -3px;
            display: inline-block;
          }

          a {
            font-size: 12px;
            color: $color-text-normal;
          }

          span {
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>

<template>
  <div id="bangumi-role-flow">
    <ul
      v-if="roles.length"
      class="roles container">
      <li
        v-for="(item, index) in roles"
        :key="index"
      >
        <router-link :to="$alias.cartoonRole(item.id)">
          <div class="clearfix">
            <div class="avatar">
              <v-img
                :src="item.avatar"
                size="90"
              />
            </div>
            <div class="summary">
              <div class="role">
                <span
                  class="name"
                  v-text="item.name"/>
                <span class="intro">：{{ item.intro }}</span>
              </div>
              <div
                v-if="item.fans_count"
                class="footer">
                <span>
                  粉丝:
                  {{ $utils.shortenNumber(item.fans_count) }}
                </span>
                ·
                <span>
                  金币:
                  {{ $utils.shortenNumber(item.star_count) }}
                </span>
                ·
                <span v-if="item.lover">
                  守护者:
                  <a :href="$alias.user(item.lover.zone)">
                    {{ item.lover.nickname }}
                    <v-img
                      :src="item.lover.avatar"
                      size="20"
                      class="image"
                    />
                  </a>
                </span>
              </div>
            </div>
          </div>
        </router-link>
      </li>
    </ul>
    <more-btn
      :no-more="resource.noMore"
      :loading="resource.loading"
      :length="roles.length"
      @fetch="getData"
    >
      <button @click="openFeedbackForRole">求偶像</button>
    </more-btn>
  </div>
</template>

<script>
export default {
  name: "VBangumiRoleFlow",
  computed: {
    info() {
      return this.$store.state.bangumi.info;
    },
    resource() {
      return this.$store.state.flow.role.hot;
    },
    roles() {
      return this.$utils.orderBy(this.resource.list, "star_count", "desc");
    }
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      try {
        await this.$store.dispatch("flow/initData", {
          type: "role",
          sort: "hot",
          ctx: this,
          bangumiId: this.info.id
        });
      } catch (e) {
        this.$toast.error(e);
      }
    },
    async getData() {
      try {
        await this.$store.dispatch("flow/getData", {
          type: "role",
          sort: "hot",
          ctx: this,
          bangumiId: this.info.id
        });
      } catch (e) {
        this.$toast.error(e);
      }
    },
    openFeedbackForRole() {
      this.$channel.$emit("open-feedback", {
        type: 6,
        desc: `我想要为《${this.info.name}》的 ? 应援`
      });
    }
  }
};
</script>
