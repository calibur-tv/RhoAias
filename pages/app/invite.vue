<style lang="scss">
$main-color: #f25d8e;
#app-invite {
  .my-space {
    .content {
      border: 2px solid $main-color;
      width: 280px;
      margin: 60px auto 20px auto;
      border-radius: 5px;
      text-align: center;
      font-size: 14px;

      img {
        display: block;
        width: 75px;
        height: 75px;
        border-radius: 50%;
        margin: -40px auto 18px;
        border: 2px solid $main-color;
        background-color: #fff;
      }

      .nickname {
        color: $main-color;
      }

      .code {
        font-size: 18px;
        margin-top: 15px;
      }

      .intro {
        color: $color-text-normal;
        font-size: 13px;
        line-height: 18px;
        width: 208px;
        margin: 15px auto;
        text-indent: 2em;
        text-align: left;
      }
    }

    .tips {
      font-size: 13px;
      color: $color-text-normal;
      text-align: center;
    }

    .invite-btn {
      display: block;
      width: 280px;
      margin: 20px auto;
      background-color: $main-color;
      border-radius: 4px;
      color: #fff;
      font-size: 14px;
      line-height: 50px;
      padding: 0 24px;
      box-shadow: 0 4px 4px rgba(255, 112, 159, 0.3);
    }
  }

  .invite-users {
    .header {
      text-align: center;
      margin-top: 20px;
      margin-bottom: 10px;

      img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        vertical-align: middle;
      }

      span {
        vertical-align: middle;
      }

      strong {
        color: $color-pink-deep;
      }
    }

    .users {
      width: 200px;
      margin: 0 auto;

      img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }

      li {
        margin-top: 10px;
        margin-bottom: 10px;
      }

      img,
      span {
        vertical-align: middle;
      }
    }
  }
}
</style>

<template>
  <div v-if="user" id="app-invite">
    <tab-container :headers="headers" @change="handleTabSwitch">
      <div slot="0" class="my-space">
        <div class="content">
          <img :src="$resize(user.avatar, { width: 150 })" />
          <p>
            <span class="nickname">{{ user.nickname }}</span
            >，你的邀请码是
          </p>
          <p class="code">
            <strong>{{ user.id }}</strong>
          </p>
          <div class="intro">
            <p>
              把这个数字告诉你的朋友，让他们注册的时候填写，那么你们就都可以获得团子
            </p>
            <p>邀请者可以得到5个团子，被邀请者可以得到2个团子</p>
          </div>
        </div>
        <p class="tips">
          你也可以直接复制注册链接给TA
        </p>
        <button
          v-clipboard="`http://calibur.tv/about/invite/${user.id}`"
          class="invite-btn"
          @success="$toast.success('复制成功~快去发送给好友吧')"
        >
          点击生成你的专属邀请码
        </button>
      </div>
      <div slot="1" class="invite-users">
        <div v-if="source" class="header">
          <img :src="$resize(user.avatar, { width: 80 })" />
          <span v-if="source.total"
            >总共邀请了&nbsp;<strong>{{ source.total }}</strong
            >&nbsp;位小伙伴</span
          >
          <span v-else>还没有邀请朋友注册</span>
        </div>
        <flow-list
          :id="user.id"
          :display-no-more="false"
          func="getUserInviteUsers"
          type="page"
          count="20"
        >
          <ul slot-scope="{ flow }" class="users">
            <li v-for="item in flow" :key="item.id">
              <img :src="$resize(item.avatar, { width: 60 })" />
              <span v-text="item.nickname" />
            </li>
          </ul>
        </flow-list>
      </div>
    </tab-container>
  </div>
</template>

<script>
import serverAuth from '~/mixins/serverAuth'
import TabContainer from '~/components/common/TabContainer'
import FlowList from '~/components/flow/FlowList'

export default {
  name: 'PageUserInvite',
  layout: 'empty',
  components: {
    TabContainer,
    FlowList
  },
  head: {
    title: '邀请码'
  },
  mixins: [serverAuth],
  data() {
    return {
      headers: ['我的邀请码', '我邀请的人']
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    source() {
      return this.$store.getters['flow/getFlow'](
        'getUserInviteUsers',
        '',
        this.user.id
      )
    }
  },
  methods: {
    handleTabSwitch(index) {
      if (index === 1) {
        this.$store.dispatch('flow/initData', {
          func: 'getUserInviteUsers',
          type: 'page',
          id: this.user.id,
          count: 20
        })
      }
    }
  }
}
</script>
