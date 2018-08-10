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
      line-height: 21px;
      border-radius: 100px;
      margin-right: 12px;
      font-size: 11px;
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
    @include twoline(16px);
  }

  .images {
    .image-list {
      .image {
        float: left;

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
      <span 
        v-if="inCommon" 
        class="badge">帖子</span>
      <a 
        :href="$alias.post(item.id)" 
        class="title" 
        v-text="item.title"/>
    </div>
    <a :href="$alias.post(item.id)">
      <div 
        class="desc" 
        v-text="item.desc"/>
      <div 
        v-if="item.images.length" 
        class="images clearfix">
        <v-img
          v-if="item.images.length === 1"
          :src="item.images[0].url"
          width="100%"
          height="190"
        />
        <div
          v-else
          class="image-list"
        >
          <v-img
            v-for="(image, index) in imageFilter(item.images)"
            :key="index"
            :src="image.url"
            class="image"
            width="32%"
            height="93"
          />
        </div>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  name: "SearchItemPost",
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
    imageFilter(images) {
      return images.slice(0, 3);
    }
  }
};
</script>
