<style lang="scss">
  #homepage {

    .slogan {
      background-color: #fff;
      padding: 17px 0 17px 20px;
      position: relative;

      li {
        margin-left: $container-padding;
        padding: 4px 0;
        font-size: 14px;
        color: #4a4a4a;
        word-wrap: break-word;
        list-style-type: disc;
      }

      img {
        position: absolute;
        right: 8px;
        top: 25px;
        width: 60px;
      }
    }

    #posts {
    }
  }
</style>

<template>
  <div id="homepage">
    <div class="slogan">
      <ul>
        <li>一个「纯粹」的二次元社区</li>
        <li>致力于实现「天下漫友是一家」</li>
        <li>交流观点，沟通想法，结识「朋友」</li>
      </ul>
      <img src="https://image.calibur.tv/owner/slogan" alt="slogan">
    </div>
    <div class="hr"></div>
    <div class="tabs border-bottom">
      <button @click="switchTab('new')" :class="{ 'active': sort === 'new' }">最新</button>
      <button @click="switchTab('hot')" :class="{ 'active': sort === 'hot' }">热门</button>
      <router-link class="fr" :to="$alias.bangumiTimeline">番剧列表</router-link>
    </div>
    <mt-loadmore
      id="posts"
      :top-method="fetchData"
      :auto-fill="false"
      ref="loadmore">
      <v-post-item
          v-for="item in list.data"
          :key="item.id"
          :item="item"
      ></v-post-item>
    </mt-loadmore>
    <more-btn
      :no-more="list.noMore"
      :loading="loading"
      @fetch="fetchData(false)"
    ></more-btn>
  </div>
</template>

<script>
  const defaultSort = 'new'

  export default {
    name: 'page-index',
    head: {
      title: '天下漫友是一家'
    },
    async asyncData ({ store, ctx }) {
      await store.dispatch('post/getTrending', {
        sort: defaultSort,
        ctx
      })
    },
    computed: {
      list () {
        return this.$store.state.post.trending[this.sort]
      }
    },
    data () {
      return {
        sort: defaultSort,
        active: defaultSort,
        loading: false
      }
    },
    watch: {
      active (tab) {
        this.sort = tab
        if (!this.$store.state.post.trending[tab].data.length) {
          this.fetchData(false)
        }
      }
    },
    methods: {
      async fetchData (reset = true, force = false) {
        if (this.loading && !force) {
          return
        }

        this.loading = true
        try {
          await this.$store.dispatch('post/getTrending', {
            sort: this.sort,
            ctx: this,
            reset
          })
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.$refs.loadmore.onTopLoaded()
          this.loading = false
        }
      },
      switchTab (tab) {
        this.sort = tab
        if (!this.$store.state.post.trending[tab].data.length) {
          this.fetchData(false, true)
        }
      }
    }
  }
</script>
