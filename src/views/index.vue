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

    .pages {
      background-color: #fff;
      padding: 20px $container-padding 16px $container-padding;

      a {
        @include btn-empty(#000);
        margin-right: 10px;
        margin-bottom: 8px;
        display: inline-block;
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
    <div class="pages">
      <router-link :to="$alias.bangumiNews">番剧列表</router-link>
      <router-link to="/role/trending">偶像排行榜</router-link>
      <router-link to="/image/trending/new">图片列表</router-link>
      <router-link to="/campaign/canvas">情景海报</router-link>
      <router-link to="/about/hello">功能简介</router-link>
    </div>
    <div class="hr"></div>
    <div class="tabs">
      <button @click="switchTab('new')" :class="{ 'active': sort === 'new' }">最新</button>
      <button @click="switchTab('hot')" :class="{ 'active': sort === 'hot' }">热门</button>
    </div>
    <ul>
      <v-post-item
        v-for="item in list.data"
        :key="item.id"
        :item="item"
      ></v-post-item>
    </ul>
    <more-btn
      :no-more="list.noMore"
      :loading="loading"
      :length="list.data.length"
      @fetch="fetchData(false)"
    ></more-btn>
  </div>
</template>

<script>
  export default {
    name: 'page-index',
    head: {
      title: '天下漫友是一家'
    },
    async asyncData ({ store, ctx }) {
      await store.dispatch('post/getTrending', {
        sort: 'new',
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
        sort: 'new',
        loading: false
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
