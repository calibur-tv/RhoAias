<style lang="scss">
.search-item-user {
  position: relative;
  padding: 12px 0;
  border-bottom: 1px solid $color-line;
  @extend %clearfix;

  .avatar {
    float: left;
    margin-right: 12px;
  }

  .intro {
    overflow: hidden;

    .head {
      margin-bottom: 5px;

      .badge {
        display: inline-block;
        height: 22px;
        padding: 0 10px;
        border: 1px solid #979797;
        color: #979797;
        text-align: center;
        line-height: 21px;
        border-radius: 100px;
        margin-right: 12px;
        font-size: 11px;
      }

      .nickname {
        color: #222;
        font-size: 16px;
        margin-right: 14px;
        font-weight: 700;
        line-height: 21px;
      }
    }

    .signature {
      font-size: 12px;
      color: #6d757a;
      @include twoline(16px);
    }
  }
}
</style>

<template>
  <div class="search-item-user">
    <nuxt-link :to="$alias.user(item.zone)" class="avatar">
      <v-img :src="item.avatar" :avatar="true" width="60" height="60" />
    </nuxt-link>
    <div class="intro">
      <div class="head">
        <span v-if="inCommon" class="badge">用户</span>
        <nuxt-link
          :to="$alias.user(item.zone)"
          class="nickname"
          v-text="item.nickname"
        />
      </div>
      <nuxt-link :to="$alias.user(item.zone)">
        <p class="signature" v-text="item.signature" />
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchItemUser',
  props: {
    item: {
      required: true,
      type: Object
    },
    inCommon: {
      required: true,
      type: Boolean,
      default: false
    }
  }
}
</script>
