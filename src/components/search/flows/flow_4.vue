<style lang="scss">
  .search-item-post {
    position: relative;
    padding: 12px 0;
    border-bottom: 1px solid $color-gray-normal;
    @extend %clearfix;

    .head {
      margin-bottom: 5px;

      .badge {
        display: inline-block;
        height: 22px;
        padding: 0 10px;
        border: 1px solid #979797;
        color: #979797;
        text-align: center;
        line-height: 22px;
        border-radius: 100px;
        margin-right: 12px;
        font-size: 12px;
      }

      .title {
        color: #222;
        font-size: 16px;
        margin-right: 14px;
        font-weight: 700;
        line-height: 21px;
      }
    }

    .desc {
      font-size: 12px;
      color: $color-text-normal;
      margin-bottom: 5px;
      @include twoline(16px)
    }

    .images {
      .image-full {
        height: 190px;
        width: 100%;
        background-color: #eee;
      }

      .image-list {
        img {
          width: 32%;
          height: auto;

          &:not(:last-child) {
            margin-right: 2%;
          }
        }
      }
    }
  }
</style>

<template>
  <div class="search-item-post">
    <div class="head">
      <span class="badge" v-if="inCommon">帖子</span>
      <a class="title" :href="$alias.post(item.id)" v-text="item.title"></a>
    </div>
    <a :href="$alias.post(item.id)">
      <div class="desc" v-text="item.desc"></div>
      <div class="images clearfix" v-if="item.images.length">
        <v-img
          class="image-full bg"
          v-if="item.images.length === 1"
          :src="item.images[0].url"
          height="190"
          mode="2"
          tag="div"
        ></v-img>
        <div class="image-list" v-else>
          <v-img
            v-for="(image, index) in imageFilter(item.images)"
            :key="index"
            :src="image.url"
            width="110"
          ></v-img>
        </div>
      </div>
    </a>
  </div>
</template>

<script>
  export default {
    name: 'search-item-post',
    props: {
      item: {
        required: true,
        type: Object
      },
      inCommon: {
        type: Boolean,
        required: true,
        default: false
      }
    },
    methods: {
      imageFilter (images) {
        return images.slice(0, 3)
      }
    }
  }
</script>
