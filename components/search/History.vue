<style lang="scss">
.search-history {
  .title {
    margin-top: 10px;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    color: #999;
  }

  li {
    position: relative;
    color: #505050;
    height: 40px;
    line-height: 39px;
    font-size: 12px;
    @include border-bottom(0);
  }

  .clear-btn {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 12px;
    color: #999;
  }
}
</style>

<template>
  <div v-if="list.length" class="search-history">
    <p class="title">
      搜索历史
    </p>
    <ul>
      <li v-for="(item, index) in list" :key="index" @click="query(item)">
        <i class="iconfont icon-lishijilu" />
        <span>{{ item }}</span>
      </li>
    </ul>
    <button class="clear-btn" @click="clear">
      清除历史记录
    </button>
  </div>
</template>

<script>
export default {
  name: 'VSearchHistory',
  data() {
    return {
      cacheKey: 'search-history',
      list: [],
      maxLen: 10
    }
  },
  mounted() {
    this.list = this.get()
  },
  methods: {
    query(q) {
      this.$router.push({
        name: 'search',
        query: { q, type: 'all' }
      })
    },
    set(q) {
      setTimeout(() => {
        const list = this.get()
        const index = list.indexOf(q)
        if (index !== -1) {
          list.splice(index, 1)
        }
        list.unshift(q)
        if (list.length > this.maxLen) {
          list.pop()
        }
        this.list = list
        try {
          localStorage.setItem(this.cacheKey, JSON.stringify(list))
        } catch (e) {
          // do nothing
        }
      }, 0)
    },
    get() {
      try {
        return JSON.parse(localStorage.getItem(this.cacheKey)) || []
      } catch (e) {
        return []
      }
    },
    clear() {
      try {
        localStorage.removeItem(this.cacheKey)
      } catch (e) {
        // do nothing
      }
      this.list = []
    }
  }
}
</script>
