<style lang="scss">
.social-panel {
  margin: 40px 0;

  .buttons {
    text-align: center;

    button {
      padding: 5px 7px;
      font-size: 11px !important;
    }
  }

  .users {
    margin-top: 25px;
    text-align: center;

    .user-face {
      margin: 0 -5px;
      display: inline-block;
      vertical-align: middle;

      img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid #fff;
      }
    }
  }
}
</style>

<template>
  <div class="social-panel">
    <div class="buttons">
      <el-button
        v-if="isCreator"
        :class="{ 'is-plain': rewarded }"
        :loading="loadingReward"
        type="warning"
        round
        size="mini"
        @click="toggleReward"
      >
        <i class="iconfont icon-like"/>
        {{ rewarded ? '已投食' : '投食' }}{{ rewardUsers.total ? `&nbsp;&nbsp;|&nbsp;&nbsp;${rewardUsers.total}` : '' }}
      </el-button>
      <el-button
        v-else
        :class="{ 'is-plain': liked }"
        :loading="loadingLike"
        type="danger"
        size="mini"
        round
        @click="toggleLike"
      >
        <i class="iconfont icon-like"/>
        {{ liked ? '已喜欢' : '喜欢' }}{{ likeUsers.total ? `&nbsp;&nbsp;|&nbsp;&nbsp;${likeUsers.total}` : '' }}
      </el-button>
      <el-button
        :class="{ 'is-plain': marked }"
        :loading="loadingMark"
        type="success"
        size="mini"
        round
        @click="toggleMark"
      >
        <i class="iconfont icon--mark"/>
        {{ marked ? '已收藏' : '收藏' }}{{ markUsers.total ? `&nbsp;&nbsp;|&nbsp;&nbsp;${markUsers.total}` : '' }}
      </el-button>
      <slot/>
    </div>
    <div class="users">
      <ul>
        <li
          v-for="user in displayUsers"
          :key="user.id"
          class="user-face"
        >
          <img :src="$resize(user.avatar, { width: 60 })">
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Api from '~/api/toggleApi'

export default {
  name: 'SocialPanel',
  props: {
    id: {
      required: true,
      type: Number
    },
    type: {
      required: true,
      type: String,
      validator: val =>
        ~['post', 'video', 'image', 'score', 'answer', 'video'].indexOf(val)
    },
    isCreator: {
      required: true,
      type: Boolean
    },
    userId: {
      required: true,
      type: Number
    },
    liked: {
      type: Boolean,
      default: false
    },
    marked: {
      type: Boolean,
      default: false
    },
    rewarded: {
      type: Boolean,
      default: false
    },
    likeUsers: {
      required: true,
      type: Object
    },
    rewardUsers: {
      required: true,
      type: Object
    },
    markUsers: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      loadingReward: false,
      loadingLike: false,
      loadingMark: false,
      displayCount: 7
    }
  },
  computed: {
    currentUserId() {
      return this.$store.state.login ? this.$store.state.user.id : 0
    },
    isMine() {
      return this.userId === this.currentUserId
    },
    displayUsers() {
      const users = this.isCreator ? this.rewardUsers.list : this.likeUsers.list
      return users.slice(0, this.displayCount)
    }
  },
  methods: {
    toggleReward() {
      if (!this.currentUserId) {
        this.$channel.$emit('sign-in')
        return
      }
      if (this.isMine) {
        this.$toast.info('不能给自己打赏')
        return
      }
      this.$confirm(
        this.rewarded
          ? '即使取消投食你的团子也不会回到你的钱包, 是否继续?'
          : '向TA投食需要消耗你一个团子，是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async () => {
          if (this.loadingReward) {
            return
          }
          this.loadingReward = true
          const api = new Api(this)
          const user = this.$store.state.user
          try {
            const result = await api.reward({
              id: this.id,
              type: this.type
            })
            if (result) {
              this.$store.commit('USE_COIN')
            }
            this.$store.commit(`${this.type}/SOCIAL_TOGGLE`, {
              key: 'reward',
              value: result,
              user: {
                id: user.id,
                zone: user.zone,
                nickname: user.nickname,
                avatar: user.avatar
              }
            })
            this.$toast.success('操作成功')
            this.$emit('reward-callback')
          } catch (e) {
            this.$toast.error(e)
          } finally {
            this.loadingReward = false
          }
        })
        .catch(() => {})
    },
    async toggleLike() {
      if (!this.currentUserId) {
        this.$channel.$emit('sign-in')
        return
      }
      if (this.isMine) {
        this.$toast.info('不能喜欢自己的内容')
        return
      }
      if (this.loadingLike) {
        return
      }
      this.loadingLike = true
      const api = new Api(this)
      const user = this.$store.state.user
      try {
        const result = await api.like({
          id: this.id,
          type: this.type
        })
        this.$store.commit(`${this.type}/SOCIAL_TOGGLE`, {
          key: 'like',
          value: result,
          user: {
            id: user.id,
            zone: user.zone,
            nickname: user.nickname,
            avatar: user.avatar
          }
        })
        this.$toast.success('操作成功')
      } catch (e) {
        this.$toast.error(e)
      } finally {
        this.loadingLike = false
      }
    },
    async toggleMark() {
      if (!this.currentUserId) {
        this.$channel.$emit('sign-in')
        return
      }
      if (this.isMine) {
        this.$toast.info('不能收藏自己的内容')
        return
      }
      if (this.loadingMark) {
        return
      }
      this.loadingMark = true
      const api = new Api(this)
      const user = this.$store.state.user
      try {
        const result = await api.mark({
          id: this.id,
          type: this.type
        })
        this.$store.commit(`${this.type}/SOCIAL_TOGGLE`, {
          key: 'mark',
          value: result,
          user: {
            id: user.id,
            zone: user.zone,
            nickname: user.nickname,
            avatar: user.avatar
          }
        })
        this.$toast.success('操作成功')
      } catch (e) {
        this.$toast.error(e)
      } finally {
        this.loadingMark = false
      }
    }
  }
}
</script>
