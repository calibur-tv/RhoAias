<style lang="scss">
  .search-input-wrap {
    position: relative;
    border-radius: 8px;

    .clear-btn {
      float: right;
      color: #757575;
      font: 27px/25px arial,sans-serif;
      padding: 0 15px 0 5px;
      line-height: 38px;
      border-top: 1px solid #d9d9d9;
      border-bottom: 1px solid #d9d9d9;
      height: 40px;
    }

    .search-btn {
      float: right;
      height: 40px;
      width: 40px;
      background-color: $color-pink-light;
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
      font-weight: bold;
      font-size: 20px;
      color: #fff;
    }

    .input-wrap {
      overflow: hidden;
      padding: 7px 0 6px;
      border: 1px solid #d9d9d9;
      border-right: 0;
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
      height: 40px;

      input {
        width: 100%;
        height: 100%;
        font-size: 18px;
        color: rgba(0,0,0,.87);
        word-wrap: break-word;
        padding: 0 0 0 16px;
      }
    }
  }
</style>

<template>
  <form class="search-input-wrap" method="get" action="#" @submit.prevent="search">
    <button class="search-btn" type="submit">
      <i class="iconfont icon-sousuo"></i>
    </button>
    <button
      v-if="q"
      class="clear-btn"
      @click="clear"
      type="button"
    >×</button>
    <div class="input-wrap">
      <input
        maxlength="200"
        name="q"
        type="search"
        aria-autocomplete="both"
        aria-haspopup="false"
        autocapitalize="off"
        autocomplete="off"
        autocorrect="off"
        role="combobox"
        spellcheck="false"
        v-model.trim="q"
        placeholder="搜索二次元的一切"
        @blur="handleInputBlur"
        aria-label="搜索"
        @keydown.enter="search"
      >
    </div>
  </form>
</template>

<script>
  import SearchApi from '~/api/searchApi'

  export default {
    name: 'search-input',
    data () {
      return {
        q: ''
      }
    },
    methods: {
      handleInputBlur () {
        document.body.scrollTop = 0
      },
      clear () {
        this.q = ''
      },
      async search () {
        const q = this.q
        if (!q.length) {
          return
        }
        this.$toast.loading('搜索中...')
        const api = new SearchApi()
        api.index({ q }).then((data) => {
          window.location = data || '/bangumi/news?from=search'
        }).catch(() => {
          window.location = '/bangumi/news?from=search'
        })
      }
    }
  }
</script>
