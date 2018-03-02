<style lang="scss">
  #notification-list {
    background-color: #fff;

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
    <ul
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="notFetch"
      infinite-scroll-distance="50"
    >
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
      </li>
    </ul>
    <more-btn
      :no-more="noMore"
      :loading="loading"
      :auto="true"
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
      notFetch () {
        return this.$store.state.login
          ? this.loading || this.noMore
          : true
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
      }
    }
  }
</script>
