<template>
  <div>
    <no-ssr>
      <slot v-if="init" />
      <div v-else
           class="v-lazy-shim"
      />
    </no-ssr>
  </div>
</template>

<script>
import Utils from '~/components/common/ImageLazyLoad/utils'

export default {
  name: 'VLazy',
  props: {
    timeout: {
      type: Number,
      default: 0
    },
    scale: {
      type: Number,
      default: 1.5
    }
  },
  data() {
    return {
      init: false
    }
  },
  watch: {
    $route() {
      this.init = false
      this.$nextTick(() => {
        this.renderComp()
      })
    }
  },
  mounted() {
    if (this.timeout) {
      setTimeout(() => {
        this.init = true
      }, this.timeout)
    } else {
      this.renderComp()
    }
  },
  methods: {
    renderComp() {
      if (Utils.checkInView(this.$el, this.scale)) {
        this.init = true
      } else {
        const id = Utils.on(
          document,
          ['scroll'],
          this.$utils.throttle(() => {
            if (Utils.checkInView(this.$el, this.scale) || this.init) {
              this.init = true
              Utils.off(id)
            }
          }, 200)
        )
      }
    }
  }
}
</script>
