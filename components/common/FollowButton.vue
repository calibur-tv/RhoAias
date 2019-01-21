<style lang="scss">
.follow-button {
  @include btn-empty($color-pink-deep);
}
</style>

<template>
  <button 
    class="follow-button"
    @click="toggleFollow">
    <i class="iconfont icon-like" /> {{ source.follow ? '已关注' : '关注' }}
  </button>
</template>

<script>
export default {
  props: {
    type: {
      required: true,
      type: String,
      validator: val => ~['bangumi', 'user', 'question'].indexOf(val)
    },
    id: {
      required: true,
      type: Number
    }
  },
  computed: {
    source() {
      return this.$store.getters['social/getState'](this.type, this.id)
    }
  },
  methods: {
    toggleFollow() {
      if (!this.$store.state.login) {
        this.$channel.$emit('sign-in')
        return
      }
      this.$store.dispatch('social/toggleAction', {
        id: this.id,
        type: this.type,
        action: 'follow'
      })
    }
  }
}
</script>
