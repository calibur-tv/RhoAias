<style lang="scss">
#user-show {
  $banner-height: 120px;

  .user-banner {
    position: relative;
    width: 100%;
    overflow: hidden;
    z-index: 0;
    height: $banner-height;

    .img {
      width: 110%;
      height: $banner-height;
      margin: -$banner-height / 2 -55%;
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: -1;
    }
  }

  .user-panel {
    position: relative;
    z-index: 0;

    .avatar {
      position: absolute;
      left: $container-padding;
      top: -40px;
      @extend %avatar;
    }

    .info {
      padding-left: 90px;
      padding-bottom: 10px;

      .nickname {
        overflow: hidden;
        line-height: 40px;
      }

      button {
        margin-top: 8px;
        float: right;
        @include btn-empty($color-blue-normal);
      }
    }

    .faker-tips {
      margin-bottom: 5px;
      padding: 8px 16px;
      border-radius: 4px;
      background-color: #fef0f0;
      color: #f56c6c;
      margin-top: 10px;

      span {
        font-size: 13px;
        line-height: 18px;
        font-weight: 700;
      }

      p {
        font-size: 12px;
        margin-top: 5px;
      }
    }

    .signature {
      font-size: 13px;
      line-height: 18px;
    }
  }

  .user-tabs {
    background-color: #ffffff;
    position: relative;
    height: 40px;
    padding-right: 10px;
    width: 100%;
    font-size: 0;
    @include border-bottom();

    a {
      height: 40px;
      line-height: 40px;
      color: #000;
      font-size: 14px;
      display: inline-block;
      text-align: center;
      padding-left: $container-padding;

      &.router-link-active {
        position: relative;

        &:before {
          content: "";
          position: absolute;
          left: $container-padding;
          right: 0;
          bottom: 1px;
          height: 2px;
          background: #333;
          border-radius: 3px;
        }
      }
    }
  }
}
</style>

<template>
  <div
    v-if="user"
    id="user-show"
  >
    <div class="user-banner">
      <div
        :style="{ backgroundImage: `url(${$resize(user.banner, { height: 240, mode: 2 })})` }"
        class="img bg"/>
    </div>
    <div class="user-panel container">
      <v-img
        :src="user.avatar"
        size="80"
        class="avatar"
      />
      <div class="info">
        <button
          v-if="isMe"
          @click="handleDaySign">{{ daySigned ? '已签到' : '签到' }}{{ coinCount ? ` (${coinCount})` : '' }}</button>
        <div class="nickname oneline">
          {{ user.nickname }}
          <user-sex
            v-if="isMe"
            :sex="convertUserSex(user.sex)"
            :secret="user.sexSecret"
          />
          <user-sex
            v-else
            :sex="user.sex"
            :secret="user.sexSecret"
          />
        </div>
      </div>
      <div class="signature">
        <p
          v-if="isMe"
          style="margin-bottom: 10px"
        >
          <strong>金币可提现额度（排除签到所得的金币）:</strong>
          {{ withdrawCoinCount }}
        </p>
        <p>
          <strong>签名：</strong>
          {{ user.signature || '这个人还很神秘...' }}
        </p>
      </div>
      <div
        v-if="user.faker"
        class="faker-tips">
        <span>重要提醒</span>
        <p>这是一个运营号，并非本人，该账号下所有信息都是搬运而来</p>
        <p>如果你就是该账号本人，可以联系网站工作人员拿回该账号，该账号通过搬运资源获得的金币也将归你所有</p>
        <p>当然，你也有权要求我们删除所有你的内容</p>
      </div>
    </div>
    <div class="user-tabs">
      <router-link :to="$alias.user(zone, 'bangumi')">番剧</router-link>
      <router-link :to="$alias.user(zone, 'post')">帖子</router-link>
      <router-link :to="$alias.user(zone, 'pins')">相册</router-link>
      <router-link :to="$alias.user(zone, 'qaq')">问答</router-link>
      <router-link :to="$alias.user(zone, 'review')">漫评</router-link>
      <router-link :to="$alias.user(zone, 'role')">偶像</router-link>
      <router-link
        v-if="isMe"
        :to="$alias.user(zone, 'draft')"
      >草稿</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
import UserSex from "~/components/user/UserSex";

export default {
  name: "UserShow",
  components: {
    UserSex
  },
  async asyncData({ route, store, ctx }) {
    await store.dispatch("users/getUser", {
      ctx,
      zone: route.params.zone
    });
  },
  head() {
    const user = this.user;
    if (!user) {
      return;
    }
    return {
      title: `${user.nickname} - 用户`,
      meta: [
        { hid: "description", name: "description", content: user.signature },
        {
          hid: "keywords",
          name: "keywords",
          content: `calibur,用户,天下漫友是一家,${user.zone},${user.nickname}`
        }
      ]
    };
  },
  data() {
    return {
      signDayLoading: false,
      doSign: false
    };
  },
  computed: {
    zone() {
      return this.$route.params.zone;
    },
    isMe() {
      return this.$store.state.login ? this.zone === this.self.zone : false;
    },
    self() {
      return this.$store.state.user;
    },
    user() {
      return this.isMe ? this.self : this.$store.state.users.show;
    },
    bangumis() {
      return this.$store.state.users.bangumis;
    },
    daySigned() {
      return this.self ? this.self.daySign : false;
    },
    coinCount() {
      return this.self ? this.self.coin : 0;
    },
    withdrawCoinCount() {
      let result = this.user.coin - this.user.coin_from_sign;
      if (this.doSign) {
        result -= 1;
      }
      return result < 0 ? 0 : result;
    }
  },
  methods: {
    async handleDaySign() {
      if (this.daySigned || this.signDayLoading) {
        return;
      }
      this.signDayLoading = true;

      try {
        await this.$store.dispatch("users/daySign", {
          ctx: this
        });
        this.$store.commit("SET_USER_INFO", {
          daySign: true,
          coin: this.coinCount + 1
        });
        this.doSign = true;
      } catch (e) {
        this.$toast.error(e);
      } finally {
        this.signDayLoading = false;
      }
    },
    convertUserSex(sex) {
      let $res = "";
      switch (sex) {
        case 0:
          $res = "未知";
          break;
        case 1:
          $res = "男";
          break;
        case 2:
          $res = "女";
          break;
        case 3:
          $res = "伪娘";
          break;
        case 4:
          $res = "药娘";
          break;
        case 5:
          $res = "扶她";
          break;
        default:
          $res = "未知";
      }
      return $res;
    }
  }
};
</script>
