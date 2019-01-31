<style lang="scss">
.gift-modal {
  position: fixed;
  width: 300px;
  height: 375px;
  left: 50%;
  top: 50%;
  background-color: #fff;
  transform: translate(-50%, -50%);
  z-index: 99;
  border-radius: 5px;

  .content {
    text-align: center;

    .avatar {
      margin-bottom: 15px;
      margin-top: -45px;

      img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 2px solid $color-blue-normal;
        background-color: #fff;
      }
    }

    .tips {
      margin-bottom: 15px;
      font-size: 14px;
      line-height: 24px;
    }

    .join,
    .abort {
      display: block;
      width: 260px;
      height: 40px;
      text-align: center;
      margin: 0 auto;
      border-radius: 4px;
      margin-bottom: 15px;
    }

    .join {
      background-color: #f25d8e;
      box-shadow: 0 4px 4px rgba(255, 112, 159, 0.3);
      color: #fff;
    }

    .abort {
      border: 1px solid $color-text-light;
      color: $color-text-light;
    }

    .expired {
      font-size: 12px;
      color: $color-pink-deep;
    }
  }
}
</style>

<template>
  <div
    v-if="showDialog"
    class="gift-modal"
  >
    <div
      v-if="user"
      class="content"
    >
      <div class="avatar">
        <img :src="user.avatar">
      </div>
      <div class="tips">
        <p>这个页面是「{{ user.nickname }}」分享给你的</p>
        <p>在这里注册，你们都将会获得「团子」奖励</p>
        <p>团子可以用来看视频，为偶像应援</p>
        <p>或经过转化之后提现，1团子相当于1人民币</p>
        <p>更重要的是，calibur 的发展需要你</p>
        <p>请加入我们吧</p>
      </div>
      <button
        class="join"
        @click="joinUs"
      >
        哟西，我加入！
      </button>
      <button
        class="abort"
        @click="abortYou"
      >
        但是，我拒绝！
      </button>
      <p class="expired">
        <span>该邀请将于</span>
        <v-time v-model="query.time"/>
        <span>失效</span>
      </p>
    </div>
  </div>
</template>

<script>
import { getUserCard } from '~/api/userApi'

export default {
  name: 'GiftModal',
  data() {
    return {
      user: null,
      showDialog: false,
      backdropId: 0
    }
  },
  computed: {
    query() {
      return this.$route.query
    },
    paramsIsOK() {
      return !!(
        this.query.uid &&
        /^\d+$/.test(this.query.uid) &&
        this.query.time &&
        /^\d+$/.test(this.query.time) &&
        Date.now() <= this.query.time * 1000 &&
        this.query.key ===
          this.$md5(`${this.query.uid}-the-world-${this.query.time}`)
      )
    },
    isGuest() {
      return !this.$store.state.haveAuthToken
    }
  },
  mounted() {
    if (this.paramsIsOK && this.isGuest) {
      this.getGiftUser()
    }
  },
  methods: {
    getGiftUser() {
      getUserCard(this, {
        id: this.query.uid
      }).then(data => {
        this.user = data
        this.showDialog = true
        this.backdropId = this.$backdrop.show({
          ele: this.$el,
          click: () => {
            this.showDialog = false
            this.$backdrop.hide(this.backdropId)
          }
        })
      })
    },
    joinUs() {
      this.$channel.$emit('sign-in', false)
    },
    abortYou() {
      this.showDialog = false
      this.$backdrop.hide(this.backdropId)
      this.$toast.success('哦，好吧...orz')
    }
  }
}
</script>
