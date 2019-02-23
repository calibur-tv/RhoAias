<style lang="scss">
.search-input-wrap {
  position: relative;
  border-radius: 8px;

  .clear-btn {
    float: right;
    color: #757575;
    font: 27px/25px arial, sans-serif;
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
      color: rgba(0, 0, 0, 0.87);
      word-wrap: break-word;
      padding: 0 10px 0 16px;
    }
  }

  .search-suggestion {
    position: absolute;
    left: 0;
    top: 110%;
    width: 100%;
    z-index: 999;
    max-height: 160px;
    background-color: #fff;
    overflow-y: scroll;
    border: 1px solid #d9d9d9;
    border-radius: 5px;

    li {
      height: 40px;
      padding: 5px 0;

      img {
        height: 30px;
        width: 30px;
        border-radius: 3px;
        vertical-align: middle;
        margin-left: 10px;
        margin-right: 8px;
      }
    }
  }
}
</style>

<template>
  <form
    class="search-input-wrap"
    method="get"
    action="#"
    @submit.prevent="submit"
  >
    <button class="search-btn" type="submit">
      <i class="iconfont icon-sousuo" />
    </button>
    <!--
    <button 
      v-if="word" 
      class="clear-btn" 
      type="button" 
      @click="clear">
      ×
    </button>
    -->
    <div class="input-wrap">
      <input
        v-model.trim="word"
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
        placeholder="搜索二次元的一切"
        aria-label="搜索"
        @blur="handleInputBlur"
        @focus="handleInputFocus"
      />
    </div>
    <ul v-show="displaySuggestion" class="search-suggestion">
      <li
        v-for="(item, index) in filteredSelect"
        :key="item.id"
        :class="{ active: index === selectedIndex }"
        @click="clickToSearch(index)"
      >
        <img :src="$resize(item.avatar, { width: 60 })" />
        <span v-text="item.name" />
      </li>
    </ul>
  </form>
</template>

<script>
export default {
  name: 'SearchInput',
  props: {
    value: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'all'
    },
    showSuggestion: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      word: this.value,
      selectedType: this.type,
      cacheKey: 'search-history',
      typing: false,
      filteredSelect: [],
      selectedIndex: -1
    }
  },
  computed: {
    bangumis() {
      return this.$store.state.bangumi.all
    },
    displaySuggestion() {
      return (
        this.showSuggestion &&
        this.word.length &&
        this.typing &&
        this.filteredSelect.length
      )
    }
  },
  mounted() {
    this.$watch('value', val => {
      this.word = val
      this.typing = true
      this.selectedIndex = -1
      this.handleEnter(val)
    })
    this.$watch('word', val => {
      this.$emit('input', val)
    })
    this.$watch('$route', val => {
      if (val.name === 'search') {
        this.word = val.query.q
        this.selectedType = val.query.type
        setTimeout(() => {
          this.typing = false
        }, 0)
      }
    })
  },
  methods: {
    handleInputBlur() {
      this.$emit('input-blur')
      document.body.scrollTop = 0
    },
    handleInputFocus() {
      this.$emit('input-focus')
      document.body.scrollTop = 0
    },
    clear() {
      this.word = ''
    },
    submit() {
      const q =
        this.selectedIndex !== -1
          ? this.filteredSelect[this.selectedIndex].name
          : this.word
      if (!q) {
        return
      }
      this.setHistory(q)
      this.$router.push({
        name: 'search',
        query: { q, type: this.selectedType }
      })
    },
    setHistory(q) {
      setTimeout(() => {
        const list = this.getHistory()
        const index = list.indexOf(q)
        if (index !== -1) {
          list.splice(index, 1)
        }
        list.unshift(q)
        if (list.length > 10) {
          list.pop()
        }
        try {
          localStorage.setItem(this.cacheKey, JSON.stringify(list))
        } catch (e) {
          // do nothing
        }
      }, 0)
    },
    getHistory() {
      try {
        return JSON.parse(localStorage.getItem(this.cacheKey)) || []
      } catch (e) {
        return []
      }
    },
    clickToSearch(index) {
      this.selectedIndex = index
      this.submit()
    },
    handleEnter(query) {
      if (!query) {
        this.filteredSelect = []
        return
      }
      this.filteredSelect = this.bangumis.filter(option => {
        return (
          option.alias.indexOf(query) > -1 || option.name.indexOf(query) > -1
        )
      })
    }
  }
}
</script>
