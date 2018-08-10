<style lang="scss">
.search-item-role {
  position: relative;
  padding: 12px 0;
  border-bottom: 1px solid $color-gray-normal;
  @extend %clearfix;

  .avatar {
    float: left;
    margin-right: 12px;
    @extend %avatar;
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

      .name {
        color: #222;
        font-size: 16px;
        margin-right: 14px;
        font-weight: 700;
        line-height: 21px;
      }
    }

    .intro {
      font-size: 12px;
      color: #6d757a;
      @include twoline(16px);
    }
  }
}
</style>

<template>
  <div class="search-item-role">
    <a 
      :href="$alias.cartoonRole(item.id)" 
      class="avatar">
      <v-img
        :src="item.avatar"
        size="60"
      />
    </a>
    <div class="intro">
      <div class="head">
        <span 
          v-if="inCommon" 
          class="badge">偶像</span>
        <a 
          :href="$alias.cartoonRole(item.id)" 
          class="name" 
          v-text="item.name"/>
      </div>
      <a :href="$alias.cartoonRole(item.id)">
        <p 
          class="intro" 
          v-text="item.intro"/>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchItemRole",
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
};
</script>
