<style lang="scss">
.nomore-wraper {
  text-align: center;

  .nomore {
    padding: 15px 0;
    font-size: 12px;
    color: #999;
  }

  .nothing {
    height: 245px;

    img {
      width: 160px;
      height: auto;
      display: block;
      margin: 20px auto;
    }

    button {
      margin-top: 15px;
      @include btn-empty(#333);
    }
  }

  .loadmore {
    width: 100%;
    height: 44px;
    line-height: 24px;
    font-size: 14px;
    padding: 10px 0;
    text-align: center;
  }

  .rolling {
    display: inline-block;
    margin-right: 8px;
    width: 20px;
    height: 20px;
    border-radius: 20px;
    border: 2px solid $color-gray-deep;
    border-bottom-color: transparent;
    vertical-align: middle;
    animation: rolling 0.8s infinite linear;
  }
}
</style>

<template>
  <div class="nomore-wraper">
    <div 
      v-if="noMore" 
      class="nomore">
      <template v-if="length">
        没有更多了，休息一下吧
      </template>
      <div 
        v-else-if="!loading" 
        class="nothing">
        <img 
          :src="$resize(`${$cdn.image}owner/no-content`, { width: 300 })" 
          alt="no-content">
        <p>还没有内容</p>
        <slot/>
      </div>
    </div>
    <template v-else>
      <template v-if="auto">
        <div
          v-show="loading" 
          class="loadmore"
        >
          <div class="rolling"/>
        </div>
      </template>
      <template v-else>
        <button
          class="loadmore"
          @click="handleFetch"
        >
          <div
            v-if="loading"
            class="rolling"
          />
          <span v-else>点击加载更多</span>
        </button>
      </template>
    </template>
  </div>
</template>

<script>
import utils from "~/components/common/ImageLazyLoad/utils";

export default {
  name: "MoreBtn",
  props: {
    noMore: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    },
    auto: {
      type: Boolean,
      default: false
    },
    length: {
      type: Number,
      default: 1
    }
  },
  mounted() {
    if (this.auto && !this.noMore) {
      const eventId = utils.on(
        document,
        "scroll",
        utils.throttle(() => {
          if (utils.checkInView(this.$el)) {
            this.$emit("fetch");
          }
          if (this.noMore) {
            utils.off(eventId);
          }
        }, 200),
        false
      );
    }
  },
  methods: {
    handleFetch() {
      if (this.loading) {
        return;
      }
      this.$emit("fetch");
    }
  }
};
</script>
