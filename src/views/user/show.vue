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
      @include avatar(80px);
      @include border(#fff, 50%);
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
      padding-right: $container-padding;

      &.active {
        position: relative;

        &:before {
          content: "";
          position: absolute;
          left: $container-padding;
          right: $container-padding;
          bottom: 1px;
          height: 2px;
          background: #333;
          border-radius: 3px;
        }
      }
    }
  }

  #bangumis {
    li {
      position: relative;
      height: 62px;
      padding: 8px 0;
      @include border-bottom();

      a {
        display: block;
      }

      img {
        width: 46px;
        height: 46px;
        margin-right: 12px;
        float: left;
      }

      p {
        color: $color-text-deep;
        font-size: 12px;
        margin-top: 6px;
        margin-bottom: 5px;
        @include twoline(14px);
      }
    }
  }

  #posts-of-reply {
    background-color: #ffffff;

    li {
      float: none;
      padding: 10px;
      position: relative;
      @include border-bottom();

      .header {
        position: relative;
        height: 32px;
        line-height: 32px;

        .time {
          float: right;
          display: block;
          color: #999;
          font-size: 12px;
          position: relative;
          z-index: 1;
          margin-right: 12px;
        }
      }

      .origin {
        display: block;
        background-color: $color-gray-normal;
        padding: 10px 20px;
        margin: 10px 0;
        border-radius: 5px;
      }

      .reply {
        display: block;
        border-left: 5px solid $color-gray-normal;
        margin: 10px 0;
        padding-left: 10px;
      }

      .content {
        margin-top: 3px;
        color: #666;
        font-size: 12px;
        line-height: 22px;
        max-height: 44px;
        overflow: hidden;
      }

      .images {
        margin-bottom: 5px;

        .image-full {
          height: 190px;
          width: 100%;
        }

        .image-list {
          img {
            width: 32%;
            height: auto;

            &:not(:last-child) {
              margin-right: 2%;
            }
          }
        }
      }

      .footer {
        color: #a3a8ad;
        font-size: 12px;
        line-height: 24px;

        span {
          margin: 0 5px;
        }
      }
    }
  }

  #roles-of-mine {
    li {
      position: relative;
      margin-top: 15px;
      padding-bottom: 15px;

      &:not(:last-child) {
        @include border-bottom();
      }

      .avatar {
        width: 80px;
        height: 80px;
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

        .lover {
          height: 20px;
          line-height: 20px;
          vertical-align: middle;
          font-size: 13px;
          color: $color-text-normal;
          overflow: hidden;
          text-align: right;

          span {
            margin-left: 10px;
            font-size: 12px;
            margin-right: 2px;
          }
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
      <div class="avatar">
        <img 
          :src="$resize(user.avatar, { width: 92 })" 
          alt="avatar">
      </div>
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
        :class="{ 'active': sort === 'mine' }" 
        @click="switchTab('mine')">发帖</button>
      <button 
        :class="{ 'active': sort === 'reply' }" 
        @click="switchTab('reply')">回复</button>
      <button 
        :class="{ 'active': sort === 'role' }" 
        @click="switchTab('role')">偶像</button>
      <button 
        :class="{ 'active': sort === 'image' }" 
        @click="switchTab('image')">相册</button>
      <button 
        :class="{ 'active': sort === 'score' }" 
        @click="switchTab('score')">漫评</button>
    </div>
    <template v-if="sort === 'bangumi'">
      <ul 
        v-if="bangumis.length" 
        id="bangumis" 
        class="container">
        <li
          v-for="item in bangumis"
          :key="item.id"
        >
          <a 
            :href="$alias.bangumi(item.id)" 
            class="clearfix">
            <v-img
              :alt="item.name"
              :src="$resize(item.avatar, { width: 160, height: 160 })"
              class="bg"
            />
            <p 
              class="name" 
              v-text="item.name"/>
          </a>
        </li>
      </ul>
      <more-btn
        v-else
        :no-more="true"
        :auto="true"
        :length="0"
        :loading="false"
      />
    </template>
    <template v-else-if="sort === 'role'">
      <ul 
        id="roles-of-mine" 
        class="container">
        <li 
          v-for="item in roles" 
          :key="item.id">
          <a :href="$alias.cartoonRole(item.id)">
            <div class="clearfix">
              <div class="avatar">
                <v-img 
                  :src="item.avatar" 
                  width="80" 
                  height="80"/>
              </div>
              <div class="summary">
                <div class="role">
                  <span 
                    class="name" 
                    v-text="item.name"/>
                  <span class="intro">：{{ item.intro }}</span>
                </div>
                <div class="lover">
                  <span>
                    粉丝:
                    {{ $utils.shortenNumber(item.fans_count) }}
                  </span>
                  <span>
                    金币:
                    {{ $utils.shortenNumber(item.star_count) }}
                  </span>
                  <span>
                    贡献:
                    {{ item.has_star }}
                  </span>
                </div>
              </div>
            </div>
          </a>
        </li>
      </ul>
      <more-btn
        :no-more="noMoreRoles"
        :loading="loadingRoles"
        :length="roles.length"
        @fetch="getUserRoles"
      />
    </template>
    <template v-else-if="sort === 'image'">
      <image-waterfall-flow
        :list="images.list"
        :no-more="images.noMore"
        :loading="images.loading"
        @load="getUserImages(false)"
      />
    </template>
    <template v-else-if="sort === 'score'">
      <user-score-flow :zone="zone"/>
    </template>
    <template v-else>
      <ul
        v-if="sort === 'mine'"
        id="posts-of-mine"
      >
        <post-flow-item
          v-for="item in posts.data"
          :key="item.id"
          :item="item"
        />
      </ul>
      <ul
        v-else-if="sort === 'reply'"
        id="posts-of-reply"
      >
        <li
          v-for="item in posts.data"
          :key="item.id"
        >
          <a 
            :href="$alias.post(item.post.id)" 
            class="header" 
            v-text="item.post.title"/>
          <a 
            :href="$alias.post(item.post.id, { comment: item.post.id })" 
            class="origin">
            <div 
              class="content" 
              v-html="item.post.content"/>
            <div 
              v-if="item.post.images.length" 
              class="images clearfix">
              <v-img
                v-if="item.post.images.length === 1"
                :src="item.post.images[0].url"
                class="image-full bg"
                height="190"
                mode="2"
                tag="div"
              />
              <div 
                v-else 
                class="image-list">
                <v-img
                  v-for="(image, index) in imageFilter(item.post.images)"
                  :key="index"
                  :src="image.url"
                  width="110"
                />
              </div>
            </div>
          </a>
          <a 
            :href="$alias.post(item.post.id, { comment: item.post.id, reply: item.id })" 
            class="reply">
            <div 
              class="content" 
              v-html="item.content"/>
            <div 
              v-if="item.images.length" 
              class="images clearfix">
              <v-img
                v-if="item.images.length === 1"
                :src="item.images[0].url"
                class="image-full bg"
                height="190"
                mode="2"
                tag="div"
              />
              <div 
                v-else 
                class="image-list">
                <v-img
                  v-for="(image, index) in imageFilter(item.images)"
                  :key="index"
                  :src="image.url"
                  width="110"
                />
              </div>
            </div>
          </a>
          <a 
            :href="$alias.bangumi(item.bangumi.id)" 
            class="footer">
            回复于
            <span v-text="item.bangumi.name"/>
            <v-time v-model="item.created_at"/>
          </a>
        </li>
      </ul>
      <more-btn
        :no-more="posts.noMore"
        :loading="posts.loading"
        :length="posts.data.length"
        @fetch="getUserPosts"
      />
    </template>
  </div>
</template>

<script>
import ImageWaterfallFlow from "~/components/image/ImageWaterfallFlow";
import UserScoreFlow from "~/components/user/flows/UserScoreFlow";
import PostFlowItem from "~/components/post/PostFlowItem";

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
    ImageWaterfallFlow,
    PostFlowItem,
    UserScoreFlow
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
      return this.isMe ? this.self : this.$store.state.users.list[this.zone];
    },
    bangumis() {
      const user = this.$store.state.users.list[this.zone];
      return user ? user.bangumis : [];
    },
    posts() {
      return this.sort === "bangumi"
        ? {}
        : this.$store.state.users.posts[this.sort];
    },
    daySigned() {
      return this.self ? this.self.daySign : false;
    },
    coinCount() {
      return this.self ? this.self.coin : 0;
    },
    roles() {
      return this.$store.state.users.roles.data;
    },
    noMoreRoles() {
      return this.$store.state.users.roles.noMore;
    },
    images() {
      return this.$store.state.image.users;
    }
  },
  methods: {
    switchTab(tab) {
      this.sort = tab;
      if (tab === "bangumi") {
        return;
      }
      if (tab === "role") {
        this.getUserRoles(true);
        return;
      }
      if (tab === "score") {
        return;
      }
      if (tab === "image") {
        this.getUserImages(true);
        return;
      }
      this.getUserPosts(true);
    },
    getUserPosts(isFirstRequest = false) {
      if (
        isFirstRequest &&
        this.$store.state.users.posts[this.sort].data.length &&
        this.$store.state.users.posts.zone === this.user.zone
      ) {
        return;
      }
      this.$store.dispatch("users/getFollowPosts", {
        type: this.sort,
        zone: this.user.zone
      });
    },
    async getUserImages(isFirstRequest = false) {
      if (isFirstRequest && this.images.list.length) {
        return;
      }
      if (this.loadingUserImageFetch) {
        return;
      }
      this.loadingUserImageFetch = true;
      try {
        await this.$store.dispatch("image/users", {
          zone: this.user.zone,
          ctx: this,
          force: isFirstRequest
        });
      } catch (e) {
        this.$toast.error(e);
      } finally {
        this.loadingUserImageFetch = false;
      }
    },
    async getUserRoles(isFirstRequest = false) {
      if (this.loadingRoles) {
        return;
      }
      this.loadingRoles = true;
      try {
        await this.$store.dispatch("users/getFollowRoles", {
          ctx: this,
          zone: this.user.zone,
          reset: isFirstRequest
        });
      } catch (e) {
        this.$toast.error(e);
      } finally {
        this.loadingRoles = false;
      }
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
    },
    imageFilter(images) {
      return images.slice(0, 3);
    }
  }
};
</script>
