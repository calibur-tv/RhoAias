<style lang="scss">
#bangumi-show {
  .bangumi-tabs {
    background-color: #ffffff;
    position: relative;
    height: 40px;
    padding-left: $container-padding;
    padding-right: $container-padding;
    width: 100%;
    font-size: 0;
    @include border-bottom();

    a {
      height: 40px;
      line-height: 40px;
      color: #000;
      font-size: 14px;
      display: inline-block;
      text-align: center;
      width: 14%;

      &.router-link-active {
        position: relative;

        &:before {
          content: '';
          position: absolute;
          left: 0;
          bottom: 1px;
          width: 100%;
          height: 2px;
          background: #333;
          border-radius: 3px;
        }
      }
    }
  }
}
</style>

<template>
  <div id="bangumi-show">
    <bangumi-header/>
    <div>
      <div class="bangumi-tabs">
        <router-link
          :to="$alias.bangumi(id, 'post')"
        >帖子</router-link>
        <router-link
          v-if="info.has_video"
          :to="$alias.bangumi(id, 'video')"
        >视频</router-link>
        <router-link
          v-if="info.has_cartoon"
          :to="$alias.bangumi(id, 'cartoon')"
        >漫画</router-link>
        <router-link
          :to="$alias.bangumi(id, 'role')"
        >偶像</router-link>
        <router-link
          :to="$alias.bangumi(id, 'pins')"
        >相册</router-link>
        <router-link
          :to="$alias.bangumi(id, 'qaq')"
        >问答</router-link>
        <router-link
          :to="$alias.bangumi(id, 'review')"
        >漫评</router-link>
      </div>
      <router-view/>
    </div>
  </div>
</template>

<script>
import BangumiHeader from '~/components/bangumi/BangumiHeader'

export default {
  name: 'BangumiShowLayout',
  async asyncData({ route, store, ctx }) {
    await store.dispatch('bangumi/getBangumi', {
      ctx,
      id: route.params.id
    })
  },
  components: {
    BangumiHeader
  },
  head() {
    if (!this.id) {
      return
    }
    let keywords = this.info.alias
    this.tags.forEach(tag => {
      keywords += `,${tag.name}`
    })
    const name = this.info.name
    keywords += `${keywords}, ${name}动漫, ${name}动画片, ${name}全集, ${name}在线观看, ${name}吧`
    const desc = this.info.summary
    return {
      title: `${name} - 番剧`,
      meta: [
        { hid: 'description', name: 'description', content: desc },
        { hid: 'keywords', name: 'keywords', content: keywords }
      ],
      script: [
        {
          hid: 'share-data',
          innerHTML: JSON.stringify({
            title: name,
            description: desc,
            imageUrl: this.info.avatar
          }),
          type: 'application/json'
        }
      ]
    }
  },
  computed: {
    id() {
      return +this.$route.params.id
    },
    info() {
      return this.$store.state.bangumi.info
    },
    tags() {
      return this.info.tags
    }
  }
}
</script>
