<style lang="scss">
#homepage {
  position: relative;
  padding: 0 10px;

  #banner {
    height: 170px;
    min-height: 50vw;
    position: relative;
    margin-top: 10px;

    div {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border-top-left-radius: 255px 15px;
      border-top-right-radius: 15px 225px;
      border-bottom-right-radius: 225px 15px;
      border-bottom-left-radius: 15px 255px;
      opacity: 0;
      transition: opacity 1s ease-in-out;
      border: 1px solid #757575;
      background-color: #757575;

      &.show {
        opacity: 1;
      }
    }
  }

  #main {
    margin-top: 20px;

    .slogan {
      text-align: center;
      margin-top: 24px;
      line-height: 28px;
      font-size: small;
    }
  }
}
</style>

<template>
  <div id="homepage">
    <section
      v-show="showBanner"
      id="banner">
      <div
        :class="{ 'show' : toggle }"
        :style="{ backgroundImage: banner1 ? `url(${$resize(banner1.url, options)})` : '' }"
        class="bg"
      />
      <div
        :class="{ 'show' : !toggle }"
        :style="{ backgroundImage: banner2 ? `url(${$resize(banner2.url, options)})` : '' }"
        class="bg"
      />
    </section>
    <main id="main">
      <v-search
        v-model="query"
        @input-focus="handleSearchFocus"
        @input-blur="handleSearchBlur"
      />
      <div class="slogan">「&nbsp;{{ slogan }}&nbsp;」</div>
    </main>
    <v-footer v-show="showFooter"/>
  </div>
</template>

<script>
import vSearch from '~/components/search/Input'
import vFooter from '~/components/layouts/Footer'
import { getBanners } from '~/api/carouselApi'

export default {
  name: 'Index',
  async asyncData({ app }) {
    const data = await getBanners(app)
    return {
      banners: data,
      banner1: data[0]
    }
  },
  components: {
    vSearch,
    vFooter
  },
  data() {
    return {
      banner1: null,
      banner2: null,
      timer: null,
      toggle: true,
      index: 0,
      showFooter: true,
      options: {
        width: 720,
        height: 0,
        mode: 0
      },
      slogan: '···',
      showBanner: true,
      query: ''
    }
  },
  mounted() {
    this.loopBanner()
    this.computeSlogan()
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  },
  methods: {
    loopBanner() {
      this.timer = setInterval(() => {
        this.index = 1 + this.index === this.banners.length ? 0 : this.index + 1
        const data = this.banners[this.index]
        this.toggle ? (this.banner2 = data) : (this.banner1 = data)
        setTimeout(() => {
          this.toggle = !this.toggle
        }, 5000)
      }, 10000)
    },
    computeSlogan() {
      const slogan = 'calibur.tv：二次元股市'
      const maxLen = slogan.length
      const maxTime = 900
      let index = 0
      const timer = setInterval(() => {
        this.slogan = slogan.slice(0, index)
        index++
        if (index > maxLen) {
          clearInterval(timer)
        }
      }, maxTime / maxLen)
    },
    handleSearchFocus() {
      this.showBanner = false
      this.showFooter = false
    },
    handleSearchBlur() {
      this.showBanner = true
      this.showFooter = true
    }
  }
}
</script>
