<style lang="scss" scoped>
  .drawer {
    z-index: 100;
    position: fixed;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: #ffffff;
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;

    &.fade-left-enter-active,
    &.fade-left-leave-active,
    &.fade-right-enter-active,
    &.fade-right-leave-active,
    &.fade-top-enter-active,
    &.fade-top-leave-active,
    &.fade-bottom-enter-active,
    &.fade-bottom-leave-active {
      transition: all cubic-bezier(0.1, 0.7, 0.1, 1) 400ms;
    }

    &.fade-left-enter,
    &.fade-left-leave-to {
      transform: translateX(-100%);
      opacity: 0;
    }

    &.fade-right-enter,
    &.fade-right-leave-to {
      transform: translateX(100%);
      opacity: 0;
    }

    &.fade-top-enter,
    &.fade-top-leave-to {
      transform: translateY(-100%);
      opacity: 0;
    }

    &.fade-bottom-enter,
    &.fade-bottom-leave-to {
      transform: translateY(100%);
      opacity: 0;
    }

    .drawer-header {
      position: relative;
      height: 46px;
      line-height: 46px;
      z-index: 1;

      button {
        position: absolute;
        font-size: 16px;
        left: 20px;
        top: 14px;
      }

      h3 {
        margin: 0;
        font-size: 16px;
        color: #333333;
        text-align: center;
      }
    }
  }
</style>
<!--
  一个抽屉组件，支持上下左右渐变出现，
  需要用 DrawerButton 这个组件来触发 Drawer 的 open，
  Drawer 的 close 只绑定在了 backdrop 上

  因为渐变的时候修改 width / height 效率不高，并且会导致 body:overflow-x:hidden 失效
  所以使用 transform
-->
<template>
  <no-ssr>
    <transition :name="`fade-${from}`">
      <div
        class="drawer"
        v-show="show"
        :style="position"
      >
        <header class="drawer-header" v-if="headerText">
          <button @click="close">关闭</button>
          <h3 v-text="headerText"></h3>
        </header>
        <slot></slot>
      </div>
    </transition>
  </no-ssr>
</template>

<script>
  /**
   * 在 Safari 设备上对于 position:fixed 支持的不好
   * 当使用 position: fixed 和 -webkit-overflow-scrolling: touch 属性时，导致 drawer 内部的 position:fixed 元素在 window.scroll 的时候上下跳动
   * 因此这里在打开抽屉的时候将 body 设为 fixed，抽屉内部使用 position:absolute 来模拟 fixed
   * 当抽屉关闭的时候，还原 body 的属性
   */
  export default {
    name: 'v-drawer',
    props: {
      value: {
        type: Boolean,
        default: false
      },
      id: {
        type: String,
        default: ''
      },
      from: {
        type: String,
        default: 'right',
        validator: val => ~['left', 'right', 'top', 'bottom'].indexOf(val)
      },
      size: {
        type: String,
        default: '70%'
      },
      headerText: {
        type: String,
        default: ''
      },
      backdrop: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        show: this.value,
        pos: 0,
        backdropId: 0
      }
    },
    watch: {
      value (val) {
        val ? this.open() : this.close()
        this.show = val
      },
      show (val) {
        this.$emit('input', val)
      },
      '$route' () {
        this.close()
      }
    },
    mounted () {
      if (this.id) {
        this.$channel.$on(`drawer-open-${this.id}`, this.open)
        this.$channel.$on(`drawer-close-${this.id}`, this.close)
      }
    },
    methods: {
      open () {
        if (this.show) {
          return
        }
        if (this.from === 'left' || this.from === 'right') {
          this.pos = window.scrollY
          document.body.style.overflow = 'hidden'
          document.body.style.position = 'fixed'
          document.body.style.top = 0
          document.body.style.bottom = 0
          document.body.style.right = 0
          document.body.style.left = 0
          document.body.style.height = `${window.innerHeight}px`
        }
        this.show = true
        if (this.id) {
          this.$channel.$emit(`drawer-open-event-${this.id}`)
        }
        if (this.backdrop) {
          this.backdropId = this.$backdrop.show({
            ele: this.$el,
            click: this.close
          })
        }
      },
      close () {
        const needReset = this.from === 'left' || this.from === 'right'
        if (needReset) {
          document.body.style.overflow = ''
          document.body.style.position = ''
          document.body.style.top = ''
          document.body.style.bottom = ''
          document.body.style.right = ''
          document.body.style.left = ''
          document.body.style.height = ''
        }
        if (!this.show) {
          return
        }
        if (needReset) {
          window.scrollTo(0, this.pos)
        }
        this.show = false
        if (this.backdrop) {
          this.$backdrop.hide(this.backdropId)
        }
        if (this.id) {
          this.$channel.$emit(`drawer-close-event-${this.id}`)
        }
      }
    },
    beforeDestroy () {
      if (this.id) {
        this.$channel.$off(`drawer-open-${this.id}`)
        this.$channel.$off(`drawer-close-${this.id}`)
      }
    },
    computed: {
      position () {
        const style = {}
        if (this.from === 'left' || this.from === 'right') {
          style.top = 0
          style.height = '100%'
          style.width = this.size
        } else {
          style.left = 0
          style.width = '100%'
          style.height = this.size
        }
        style[this.from] = 0
        return style
      }
    }
  }
</script>
