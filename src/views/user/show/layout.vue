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
    }

    .info {
      padding-left: 90px;
      padding-bottom: 10px;

      .nickname {
        overflow: hidden;
        line-height: 40px;

        .level {
          margin-left: 7px;
          color: $color-text-light;
        }
      }

      button {
        margin-top: 8px;
        float: right;
        @include btn-empty($color-blue-normal);
      }
    }

    .faker-tips {
      margin-bottom: 5px;
      padding: 6px 13px 8px;
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

    .exp-container {
      font-size: 12px;
      line-height: 14px;
      margin-bottom: 10px;
      margin-top: 10px;

      .title {
        float: left;
        font-size: 13px;
      }

      .level {
        float: left;
        margin-right: 5px;
      }

      .detail {
        float: right;
        margin-left: 6px;
      }

      i {
        float: right;
        line-height: 16px;
        font-size: 13px;
        margin-left: 3px;
      }

      .el-progress {
        overflow: hidden;
      }
    }

    .exp-detail {
      padding: 5px 8px 3px;
      background-color: $color-gray-normal;
      color: $color-text-normal;
      margin-bottom: 10px;
      border-radius: 4px;
      font-size: 12px;
      line-height: 20px;
    }
  }

  .user-tabs {
    background-color: #ffffff;
    position: relative;
    padding-right: 10px;
    width: 100%;
    font-size: 0;
    overflow-y: hidden;
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
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
        :avatar="true"
        :share="true"
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
            :sex="user.sex"
            :secret="user.sexSecret"
          />
          <template v-else>
            <user-sex
              :sex="user.sex"
              :secret="user.sexSecret"
            />
            <span class="level">Lv{{ user.level }}</span>
          </template>
        </div>
      </div>
      <div class="signature">
        <template v-if="isMe">
          <p>
            <strong>团子可提现额度（排除签到所得的团子）:</strong>
            {{ withdrawCoinCount }}
          </p>
          <div
            class="exp-container"
            @click="showExpTips = !showExpTips"
          >
            <strong class="title">等级：</strong>
            <span class="level">Lv{{ user.exp.level }}</span>
            <i :class="showExpTips ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"/>
            <span class="detail">{{ user.exp.have_exp }} / {{ user.exp.next_level_exp }}</span>
            <el-progress
              :show-text="false"
              :stroke-width="14"
              :percentage="expPercent"
              color="#f25d8e"
            />
          </div>
          <div
            v-if="showExpTips"
            class="exp-detail"
          >
            <ul>
              <li>每日签到：+2</li>
              <li>发帖子：+4</li>
              <li>写漫评：+5</li>
              <li>写回答：+4</li>
              <li>传图片（限图片区）：+3</li>
              <li>提问题（限问答区）：+3</li>
              <li>写评论（包括跟帖）：+2</li>
              <li>回复评论：+1</li>
              <li>获得喜欢：+2</li>
              <li>获得收藏：+2</li>
              <li>获得团子：+3</li>
            </ul>
            <p>
              <strong>评论/回复自己的内容不会获得经验</strong>
            </p>
            <p>
              <strong>少于15字的内容，是没有经验的</strong>
            </p>
            <p>
              <strong>如果内容被删除，会掉经验和等级</strong>
            </p>
          </div>
        </template>
        <p style="margin-bottom: 10px">
          <strong>签名：</strong>
          {{ user.signature || '这个人还很神秘...' }}
        </p>
        <p>
          <strong>战斗力：</strong>
          {{ userPower }}
        </p>
      </div>
      <div
        v-if="user.faker"
        class="faker-tips">
        <span>重要提醒</span>
        <p>这是一个运营号，并非本人，该账号下所有信息都是搬运而来</p>
        <p>如果你就是该账号本人，可以联系网站工作人员拿回该账号，该账号通过搬运资源获得的团子也将归你所有</p>
        <p>当然，你也有权要求我们删除所有你的内容</p>
      </div>
      <div
        v-if="blockedAt"
        class="faker-tips"
      >
        <span>该用户已被禁言，禁言至：{{ blockedAt }}，可能是由于以下原因：</span>
        <p>1. 破坏社区环境，包括但不限于：无脑刷屏、复制他人内容来发表</p>
        <p>2. 恶意带节奏</p>
        <p>3. 发表于二次元无关的内容</p>
        <p>4. 其它原因还没想好，希望大家引以为戒</p>
        <p>如果想要提前申诉解禁，请加QQ群反馈</p>
      </div>
    </div>
    <div class="user-tabs">
      <router-link :to="$alias.user(zone, 'bangumi')">番剧</router-link>
      <router-link :to="$alias.user(zone, 'post')">帖子</router-link>
      <router-link :to="$alias.user(zone, 'pins')">相册</router-link>
      <router-link :to="$alias.user(zone, 'qaq')">问答</router-link>
      <router-link :to="$alias.user(zone, 'review')">漫评</router-link>
      <router-link :to="$alias.user(zone, 'role')">偶像</router-link>
      <template v-if="isMe">
        <router-link :to="$alias.user(zone, 'mark')">收藏</router-link>
        <router-link :to="$alias.user(zone, 'draft')">草稿</router-link>
      </template>
    </div>
    <router-view class="user-main-view"/>
  </div>
</template>

<script>
import UserSex from "~/components/user/UserSex";
import { Progress } from "element-ui";

export default {
  name: "UserShow",
  components: {
    UserSex,
    "el-progress": Progress
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
      title: user.nickname,
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
      doSign: false,
      showExpTips: false
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
    userPower() {
      return this.$store.state.users.show.power;
    },
    blockedAt() {
      return this.$store.state.users.show.banned_to;
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
    },
    expPercent() {
      if (!this.isMe) {
        return 0;
      }
      return parseInt(
        (this.user.exp.have_exp / this.user.exp.next_level_exp) * 100,
        10
      );
    }
  },
  methods: {
    async handleDaySign() {
      if (this.daySigned || this.signDayLoading) {
        this.$toast.info("今天已签过到");
        return;
      }
      this.signDayLoading = true;

      try {
        const result = await this.$store.dispatch("users/daySign", {
          ctx: this
        });
        this.$store.commit("SET_USER_INFO", {
          daySign: true,
          coin: this.coinCount + 1
        });
        this.doSign = true;
        this.$toast.success(result.message);
        this.$store.commit("UPDATE_USER_EXP", result.exp);
      } catch (e) {
        this.$toast.error(e);
      } finally {
        this.signDayLoading = false;
      }
    }
  }
};
</script>
