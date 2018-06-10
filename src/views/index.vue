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
      <a :href="$alias.bangumiNews">番剧列表</a>
      <a href="/role/trending">偶像排行榜</a>
      <a href="/image/trending/new">图片列表</a>
      <a href="/campaign/canvas">情景海报</a>
      <a href="/about/hello">功能简介</a>
    </div>
    <div class="hr"></div>
    <div class="tabs">
      <button @click="switchTab('news')" :class="{ 'active': sort === 'news' }">最新</button>
      <button @click="switchTab('active')" :class="{ 'active': sort === 'active' }">动态</button>
      <button @click="switchTab('hot')" :class="{ 'active': sort === 'hot' }">热门</button>
    </div>
    <ul>
      <v-post-item
        v-for="item in post.list"
        :key="item.id"
        :item="item"
      ></v-post-item>
    </ul>
    <more-btn
      :no-more="post.noMore"
      :loading="post.loading"
      :length="post.list.length"
      @fetch="fetchData(false)"
    ></more-btn>
  </div>
</template>

<script>
  import PostApi from '~/api/postApi'

  export default {
    name: 'page-index',
    head: {
      title: '天下漫友是一家'
    },
    async asyncData ({ store, ctx }) {
      await store.dispatch('trending/getTrending', {
        type: 'post',
        sort: 'active',
        api: new PostApi(ctx)
      })
    },
    computed: {
      post () {
        return this.$store.state.trending[this.sort]
      }
    },
    data () {
      return {
        sort: 'active'
      }
    },
    methods: {
      async fetchData (reset) {
        try {
          if (reset) {
            await this.$store.dispatch('trending/getTrending', {
              type: 'post',
              sort: this.sort,
              api: new PostApi(this)
            })
          } else {
            await this.$store.dispatch('trending/loadMore', {
              type: 'post',
              sort: this.sort,
              api: new PostApi(this)
            })
          }
        } catch (e) {
          this.$toast.error(e)
        }
      },
      switchTab (tab) {
        this.sort = tab
        this.fetchData(true)
      }
    }
  }
</script>
