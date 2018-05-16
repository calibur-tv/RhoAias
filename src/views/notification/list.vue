<style lang="scss">
  #notification-list {
    background-color: #fff;

    .clear-btn {
      width: 100%;
      padding: 10px 0;
      margin: 10px 0;
      font-size: 12px;
      color: $color-text-normal;
    }

    li {
      font-size: 13px;
      width: 100%;
      min-height: 50px;
      line-height: 20px;
      padding: 15px 20px;
      background-color: $color-gray-light;
      border-top: 1px solid #eee;

      &.checked {
        background-color: transparent;
      }
    }

    a {
      color: $color-blue-normal;
      font-size: 13px;
    }
  }
</style>

<template>
  <div id="notification-list">
    <button class="clear-btn" @click="readAll">全部设为已读</button>
    <ul>
      <li
        v-for="item in list"
        :key="item.id"
        :class="{ 'checked': item.checked }"
        @click="readMsg(item.id)"
      >
        <!-- 我的主题帖被回复了 -->
        <template v-if="item.type === 1">
          <router-link :to="$alias.user(item.user.zone)" v-text="item.user.nickname"></router-link>
          回复了你的帖子
          <router-link :to="item.data.link" v-text="item.data.title"></router-link>
        </template>
        <!-- 我的楼层贴被评论 / 回复了 -->
        <template v-else-if="item.type === 2">
          <router-link :to="$alias.user(item.user.zone)" v-text="item.user.nickname"></router-link>
          评论了你在帖子
          <router-link :to="item.data.link" v-text="item.data.title"></router-link>
          下的内容
        </template>
        <template v-else-if="item.type === 3">
          <router-link :to="$alias.user(item.user.zone)" v-text="item.user.nickname"></router-link>
          喜欢了你的帖子
          <router-link :to="item.data.link" v-text="item.data.title"></router-link>
        </template>
        <template v-else-if="item.type === 4">
          <router-link :to="$alias.user(item.user.zone)" v-text="item.user.nickname"></router-link>
          赞了你在帖子
          <router-link :to="item.data.link" v-text="item.data.title"></router-link>
          下的回复
        </template>
        <template v-else-if="item.type === 5">
          <router-link :to="$alias.user(item.user.zone)" v-text="item.user.nickname"></router-link>
          喜欢了你上传的图片
        </template>
      </li>
    </ul>
    <more-btn
      :no-more="noMore"
      :loading="loading"
      @fetch="loadMore"
    ></more-btn>
  </div>
</template>

<script>
  export default {
    name: 'page-notification-list',
    async asyncData ({ store, ctx }) {
      await store.dispatch('users/getNotifications', {
        ctx,
        reset: true
      })
    },
    computed: {
      list () {
        return this.$store.state.users.notifications.data
      },
      noMore () {
        return this.$store.state.users.notifications.noMore
      },
      notificationsCount () {
        const result = this.$store.state.user.notification - this.$store.state.users.notifications.checked
        return result < 0 ? 0 : result
      }
    },
    data () {
      return {
        loading: false
      }
    },
    methods: {
      readMsg (id) {
        this.$store.dispatch('users/readMessage', {
          id,
          ctx: this
        })
      },
      async loadMore () {
        if (this.loading) {
          return
        }
        this.loading = true

        try {
          await this.$store.dispatch('users/getNotifications', {
            ctx: this,
            reset: false
          })
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.loading = false
        }
      },
      readAll () {
        if (!this.notificationsCount) {
          this.$toast.success('消息已清空')
          return
        }
        try {
          this.$store.dispatch('users/readAllMessage', this)
          this.$toast.success('消息已清空')
        } catch (e) {
          this.$toast.error(e)
        }
      }
    }
  }
</script>
