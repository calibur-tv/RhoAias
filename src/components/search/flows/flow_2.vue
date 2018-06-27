<style lang="scss">
  .search-item-bangumi {
    position: relative;
    padding: 12px 0;
    border-bottom: 1px solid $color-gray-normal;
    @extend %clearfix;

    .avatar {
      float: left;
      margin-right: 12px;
      width: 60px;
      height: 80px;
      border-radius: 4px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
      }
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

      .summary {
        font-size: 12px;
        color: $color-text-normal;
        @include twoline(16px)
      }
    }
  }
</style>

<template>
  <div class="search-item-bangumi">
    <a :href="$alias.bangumi(item.id)" class="avatar">
      <img :src="$resize(item.avatar, { width: 120, height: 160 })" :alt="item.name">
    </a>
    <div class="intro">
      <div class="head">
        <span class="badge" v-if="inCommon">番剧</span>
        <a class="name" :href="$alias.bangumi(item.id)" v-text="item.name"></a>
      </div>
      <a :href="$alias.bangumi(item.id)">
        <p class="summary" v-text="item.summary"></p>
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'search-item-bangumi',
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
