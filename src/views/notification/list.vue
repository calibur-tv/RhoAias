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
    <button 
      class="clear-btn" 
      @click="readAll">全部设为已读</button>
    <ul>
      <li
        v-for="item in list"
        :key="item.id"
        :class="{ 'checked': item.checked }"
        @click="readMsg(item.id)"
      >
        <div
          @click.prevent="handleMessageClick($event, item)"
          v-html="item.message"
        />
      </li>
    </ul>
    <more-btn
      :no-more="noMore"
      :loading="loading"
      @fetch="loadMore"
    />
  </div>
</template>

<script>
export default {
  name: "PageNotificationList",
  async asyncData({ store, ctx }) {
    await store.dispatch("users/getNotifications", {
      ctx,
      reset: true
    });
  },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    list() {
      return this.$store.state.users.notifications.list;
    },
    noMore() {
      return this.$store.state.users.notifications.noMore;
    },
    notificationsCount() {
      const result =
        this.$store.state.user.notification -
        this.$store.state.users.notifications.checked;
      return result < 0 ? 0 : result;
    }
  },
  methods: {
    readMsg(id) {
      this.$store.dispatch("users/readMessage", {
        id,
        ctx: this
      });
    },
    async loadMore() {
      if (this.loading) {
        return;
      }
      this.loading = true;

      try {
        await this.$store.dispatch("users/getNotifications", {
          ctx: this,
          reset: false
        });
      } catch (e) {
        this.$toast.error(e);
      } finally {
        this.loading = false;
      }
    },
    readAll() {
      if (!this.notificationsCount) {
        this.$toast.success("消息已清空");
        return;
      }
      try {
        this.$store.dispatch("users/readAllMessage", this);
        this.$toast.success("消息已清空");
      } catch (e) {
        this.$toast.error(e);
      }
    },
    handleMessageClick(evt, msg) {
      if (/user/.test(evt.target.classList)) {
        window.location = this.$alias.user(msg.user.zone);
        return;
      }
      window.location = msg.link;
    }
  }
};
</script>
