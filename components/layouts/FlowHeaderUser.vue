<style lang="scss">
.user-panel {
  @extend %clearfix;
  margin-bottom: 20px;

  .user-avatar {
    float: left;
    margin-right: 10px;
  }

  .slot {
    float: right;
  }

  .user-info {
    height: 40px;
    overflow: hidden;

    .user-nickname {
      margin-top: 2px;
      margin-bottom: 1px;
    }

    time {
      color: $color-text-light;
      margin-top: 3px;
      @include half-font(10px, top);
    }
  }
}
</style>

<template>
  <div class="user-panel">
    <UserAvatar :user="user" />
    <div class="slot">
      <slot />
    </div>
    <div class="user-info">
      <UserNickname :user="user" />
      <VTime v-model="time" />
    </div>
  </div>
</template>

<script>
import UserAvatar from '~/components/user/UserAvatar'
import UserNickname from '~/components/user/UserNickname'

export default {
  name: 'FlowHeaderUser',
  components: {
    UserAvatar,
    UserNickname
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    time: {
      type: String,
      required: true
    }
  }
}
</script>
