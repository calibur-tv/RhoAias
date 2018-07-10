<template>
  <div id="bangumi-show">
    <bangumi-header></bangumi-header>
    <div class="hr"></div>
    <div>
      <div class="tabs">
        <button @click="switchTab('post')" :class="{ 'active': sort === 'post' }">帖子</button>
        <button @click="switchTab('video')" :class="{ 'active': sort === 'video' }" v-if="info.has_video">视频</button>
        <button @click="switchTab('cartoon')" :class="{ 'active': sort === 'cartoon' }" v-if="info.has_cartoon">漫画</button>
        <button @click="switchTab('role')" :class="{ 'active': sort === 'role' }">偶像</button>
        <button @click="switchTab('image')" :class="{ 'active': sort === 'image' }">相册</button>
      </div>
      <bangumi-post-flow
        v-if="sort === 'post'"
      ></bangumi-post-flow>
      <bangumi-video-flow
        v-else-if="sort === 'video'"
      ></bangumi-video-flow>
      <bangumi-cartoon-flow
        v-else-if="sort === 'cartoon'"
      ></bangumi-cartoon-flow>
      <bangumi-role-flow
        v-else-if="sort === 'role'"
      ></bangumi-role-flow>
      <bangumi-image-flow
        v-else-if="sort === 'image'"
      ></bangumi-image-flow>
    </div>
  </div>
</template>

<script>
  import BangumiHeader from '~/components/bangumi/BangumiHeader'
  import BangumiPostFlow from '~/components/bangumi/flows/BangumiPostFlow'
  import BangumiVideoFlow from '~/components/bangumi/flows/BangumiVideoFlow'
  import BangumiCartoonFlow from '~/components/bangumi/flows/BangumiCartoonFlow'
  import BangumiRoleFlow from '~/components/bangumi/flows/BangumiRoleFlow'
  import BangumiImageFlow from '~/components/bangumi/flows/BangumiImageFlow'

  export default {
    name: 'bangumi-show',
    async asyncData ({ route, store, ctx }) {
      const id = route.params.id
      await Promise.all([
        store.dispatch('bangumi/getBangumi', { ctx, id }),
        store.dispatch('bangumi/getTopPosts', { ctx, id }),
        store.dispatch('trending/getTrending', {
          type: 'post',
          sort: 'active',
          bangumiId: id,
          ctx
        })
      ])
    },
    components: {
      BangumiHeader,
      BangumiPostFlow,
      BangumiVideoFlow,
      BangumiCartoonFlow,
      BangumiRoleFlow,
      BangumiImageFlow
    },
    head () {
      if (!this.id) {
        return
      }
      let keywords = this.info.alias
      this.tags.forEach(tag => {
        keywords += `,${tag.name}`
      })
      const name = this.info.name
      keywords += `${keywords}, ${name}动漫, ${name}动画片, ${name}全集, ${name}在线观看, ${name}吧`
      return {
        title: `${name} - 番剧`,
        meta: [
          { hid: 'description', name: 'description', content: this.info.summary },
          { hid: 'keywords', name: 'keywords', content: keywords }
        ]
      }
    },
    computed: {
      id () {
        return this.$route.params.id
      },
      info () {
        return this.$store.state.bangumi.info
      },
      tags () {
        return this.info.tags
      }
    },
    data () {
      return {
        sort: 'post'
      }
    },
    methods: {
      switchTab (tab) {
        this.sort = tab
      }
    },
    mounted () {
      if (this.info.has_video) {
        setTimeout(() => {
          this.switchTab('video')
        }, 1000)
      }
    }
  }
</script>
