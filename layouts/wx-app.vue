<template>
  <nuxt />
</template>

<script>
import clientAuth from '~/mixins/clientAuth'

export default {
  name: 'WxAppLayout',
  mixins: [clientAuth],
  mounted() {
    this.showDebugBar()
  },
  methods: {
    showDebugBar() {
      if (process.env.NODE_ENV === 'development') {
        const parent = document.body
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src =
          'https://res2.wx.qq.com/mmbizwap/zh_CN/htmledition/js/vconsole/3.0.0/vconsole.min.js'
        parent.parentNode.insertBefore(script, parent)
        script.addEventListener('load', () => {
          new VConsole() // eslint-disable-line
        })
      }
    }
  }
}
</script>
