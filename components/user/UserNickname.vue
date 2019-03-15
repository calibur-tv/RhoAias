<style lang="scss">
.user-nickname {
  display: flex;
  flex-direction: row;
  align-items: center;

  .nickname {
    overflow: hidden;
    color: $color-text-normal;
    font-size: 16px;
    line-height: 23px;
  }

  .badge {
    flex-shrink: 0;
  }

  .master-badge {
    border: 1px solid $color-pink-normal;
    color: $color-pink-normal;
    border-radius: 10px;
    width: 34px;
    height: 20px;
    margin-left: 5px;

    span {
      width: 200%;
      text-align: center;
      height: 200%;
      line-height: 36px;
    }
  }
}
</style>

<template>
  <div class="user-nickname">
    <div class="nickname" @click.stop="toUser">
      <p class="oneline" v-text="user.nickname" />
    </div>
    <span v-if="isMaster" class="badge master-badge"><span>楼主</span></span>
  </div>
</template>

<script>
export default {
  name: 'UserNickname',
  props: {
    user: {
      type: Object,
      required: true
    },
    isMaster: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toUser() {
      this.$router.push(this.$alias.user(this.user.zone))
    }
  }
}
</script>
