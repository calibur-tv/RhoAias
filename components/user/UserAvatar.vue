<style lang="scss">
.user-avatar {
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid $color-avatar-border;

  img {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>

<template>
  <div
    :style="{ width: $px2vw(size), height: $px2vw(size) }"
    class="user-avatar"
    @click.stop="toUser"
  >
    <img :src="$resize(user.avatar, { width: size * 2 })">
  </div>
</template>

<script>
export default {
  name: 'UserAvatar',
  props: {
    user: {
      type: Object,
      required: true
    },
    size: {
      type: Number,
      default: 40
    }
  },
  methods: {
    toUser() {
      this.$router.push(this.$alias.user(this.user.zone))
    }
  }
}
</script>
