<style lang="scss" scoped>
  .nomore {
    text-align: center;
    background-color: $color-background;
    font-size: 12px;
    color: #999;
    padding: 5px 0;
  }

  .loadmore {
    text-align: center;
    background-color: #ffffff;
    width: 100%;
    height: 44px;
    line-height: 44px;
    font-size: 14px;
  }
</style>

<template>
  <div class="nomore" v-if="noMore">没有更多了，休息一下吧</div>
  <button class="loadmore" @click="handleFetch" v-else>{{ loading ? '加载中...' : '点击加载更多' }}</button>
</template>

<script>
  export default {
    name: 'more-btn',
    props: {
      noMore: {
        type: Boolean,
        required: true
      },
      loading: {
        type: Boolean,
        required: true
      }
    },
    methods: {
      handleFetch () {
        if (this.loading) {
          return
        }
        this.$emit('fetch')
      }
    }
  }
</script>
