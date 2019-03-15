<style lang="scss">
$height: 40px;
$font-size: 14px;

.flow-state-wrap {
  .state-error,
  .state-no-more,
  .state-fetch-btn-text,
  .state-loading,
  .state-shim {
    text-align: center;
    height: $height;
    line-height: $height;

    span {
      font-size: $font-size;
    }
  }

  .state-loading {
    i {
      display: inline-block;
      margin-right: 8px;
      width: 20px;
      height: 20px;
      border-radius: 20px;
      border: 2px solid $color-text-light;
      border-bottom-color: transparent;
      vertical-align: middle;
      animation: rolling 0.8s infinite linear;
    }

    span {
      vertical-align: middle;
    }
  }

  .state-nothing {
    height: 245px;
    text-align: center;

    img {
      width: 160px;
      height: auto;
      display: block;
      margin: 20px auto;
    }

    span {
      font-size: 12px;
      color: #999;
    }
  }

  button {
    width: 100%;
  }

  @include keyframes(rolling) {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
</style>

<template>
  <div class="flow-state-wrap">
    <div v-if="error"
         @click="fetch"
    >
      <slot name="error">
        <div class="state-error">
          <span>出错了，点击重试</span>
        </div>
      </slot>
    </div>
    <div v-else-if="nothing">
      <slot name="nothing">
        <div class="state-nothing">
          <img
            src="~assets/img/no-content.png" alt="no-content"
          >
          <span>这里什么都没有</span>
        </div>
      </slot>
    </div>
    <div v-else-if="noMore">
      <slot name="no-more">
        <div v-if="displayNoMore"
             class="state-no-more"
        >
          <span>没有更多了</span>
        </div>
      </slot>
    </div>
    <div v-else-if="loading">
      <slot name="loading">
        <div class="state-loading">
          <i />
          <span>加载中…</span>
        </div>
      </slot>
    </div>
    <div v-else-if="auto"
         class="state-shim"
    />
    <button v-else
            @click="fetch"
    >
      <slot name="load-btn">
        <div class="state-fetch-btn-text">
          <span>点击加载更多</span>
        </div>
      </slot>
    </button>
  </div>
</template>

<script>
import Utils from '~/components/common/ImageLazyLoad/utils'

export default {
  name: 'FlowState',
  props: {
    auto: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    noMore: {
      type: Boolean,
      default: false
    },
    nothing: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    fetch: {
      type: Function,
      required: true
    },
    displayNoMore: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    if (this.auto) {
      this.onScroll()
    }
  },
  methods: {
    getTarget() {
      let el = this.$el
      while (
        el.tagName !== 'HTML' &&
        el.tagName !== 'BOYD' &&
        el.nodeType === 1
      ) {
        const overflowY = window.getComputedStyle(el).overflowY
        if (overflowY === 'scroll' || overflowY === 'auto') {
          return el
        }
        el = el.parentNode
      }
      return document
    },
    onScroll() {
      if (this.error) {
        return
      }
      if (Utils.checkInView(this.$el)) {
        this.fetch()
      }
      const id = Utils.on(
        this.getTarget(),
        ['scroll'],
        this.$utils.throttle(() => {
          if (this.error) {
            return
          }
          if (this.noMore || !this.auto) {
            Utils.off(id)
            return
          }
          if (Utils.checkInView(this.$el)) {
            this.fetch()
          }
        }, 200)
      )
    }
  }
}
</script>
