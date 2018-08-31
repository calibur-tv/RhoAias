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

    button {
      height: 40px;
      line-height: 40px;
      color: #000;
      font-size: 14px;
      display: inline-block;
      text-align: center;
      padding-left: $container-padding;

      &.active {
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
  <div id="user-show">
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
        <p 
          class="nickname oneline" 
          v-text="user.nickname"/>
      </div>
      <p class="signature">
        <strong>签名：</strong>
        {{ user.signature || '这个人还很神秘...' }}
      </p>
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
      <button 
        :class="{ 'active': sort === 'bangumi' }" 
        @click="switchTab('bangumi')">番剧</button>
      <button 
        :class="{ 'active': sort === 'post' }"
        @click="switchTab('post')">帖子</button>
      <button
        :class="{ 'active': sort === 'image' }" 
        @click="switchTab('image')">相册</button>
      <button
        :class="{ 'active': sort === 'question' }"
        @click="switchTab('question')">问答</button>
      <button 
        :class="{ 'active': sort === 'score' }" 
        @click="switchTab('score')">漫评</button>
      <button
        :class="{ 'active': sort === 'role' }"
        @click="switchTab('role')">偶像</button>
      <button
        v-if="isMe"
        :class="{ 'active': sort === 'draft' }"
        @click="switchTab('draft')">草稿</button>
    </div>
    <user-bangumi-flow
      v-if="sort === 'bangumi'"
    />
    <user-post-flow
      v-else-if="sort === 'post'"
      :zone="zone"
    />
    <image-flow-list
      v-else-if="sort === 'image'"
      :user-zone="zone"
    />
    <user-qa-flow-list
      v-else-if="sort === 'question'"
      :user-zone="zone"
    />
    <score-flow-list
      v-else-if="sort === 'score'"
      :user-zone="zone"
    />
    <cartoon-role-flow-list
      v-else-if="sort === 'role'"
      :user-zone="zone"
    />
    <user-draft-list
      v-else-if="sort === 'draft'"
      :user-zone="zone"
    />
  </div>
</template>

<script>
import UserBangumiFlow from "~/components/user/flows/UserBangumiFlow";
import UserPostFlow from "~/components/user/flows/UserPostFlow";
import ImageFlowList from "~/components/flow/list/ImageFlowList";
import UserQaFlowList from "~/components/user/flows/UserQaFlowList";
import ScoreFlowList from "~/components/flow/list/ScoreFlowList";
import CartoonRoleFlowList from "~/components/flow/list/CartoonRoleFlowList";
import UserDraftList from "~/components/user/flows/UserDraftList";

export default {
  name: "UserShow",
  async asyncData({ route, store, ctx }) {
    const zone = route.params.zone;
    const arr = [
      store.dispatch("users/getUser", {
        ctx,
        zone
      }),
      store.dispatch("users/getFollowBangumis", {
        ctx,
        zone
      })
    ];
    await Promise.all(arr);
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
  components: {
    UserBangumiFlow,
    UserPostFlow,
    ImageFlowList,
    UserQaFlowList,
    ScoreFlowList,
    CartoonRoleFlowList,
    UserDraftList
  },
  data() {
    return {
      sort: "bangumi",
      signDayLoading: false,
      loadingRoles: false,
      loadingUserImageFetch: false,
      userImageLoaded: false
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
    }
  },
  methods: {
    switchTab(tab) {
      this.sort = tab;
      this.$nextTick(() => {
        this.$channel.$emit(`user-tab-switch-${tab}`);
      });
    },
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
      } catch (e) {
        this.$toast.error(e);
      } finally {
        this.signDayLoading = false;
      }
    }
  }
};
</script>
