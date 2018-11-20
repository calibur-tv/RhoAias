<style lang="scss">
#post-world {
  .img {
    background-color: RGB(60, 134, 247);
  }
}
</style>

<template>
  <div id="post-world">
    <div class="intro">
      <div class="img">帖</div>
      <div class="summary">
        <h2 class="title">帖吧</h2>
        <div class="extra">共 <strong v-text="meta.collection"/> 个吧&nbsp;·&nbsp;发表了 <strong v-text="meta.total"/> 条帖子</div>
        <button
          @click="showTips = !showTips"
        >
          {{ showTips ? '收起' : '查看' }}板块介绍
          <i :class="showTips ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"/>
        </button>
      </div>
    </div>
    <div
      v-if="showTips"
      class="detail"
    >
      <p>
        「calibur.tv」的贴吧功能与
        <a
          href="javascript:;"
        >「百度贴吧」</a>
        基本相同，不过本站目前只允许开设「二次元」领域的贴吧，非二次元相关话题是不允许的；
      </p>
      <p>
        「贴吧」板块讨论的话题应该更加的轻松一些，大家天马星空的想法都可以在此发表，
        如果你想写一篇专业的漫评，可以到
        <a :href="$alias.world('review')">「漫评」</a>
        板块发文；
      </p>
      <p>
        如果你想为你喜欢的动漫角色盖楼，那么非常荣幸的告诉你，我们为 “盖楼” 专门开发了一个
        <router-link :to="$alias.roleTrending">「应援」</router-link>
        系统，每次应援都需要消耗
        <router-link to="/about/hello">「团子」</router-link>
        ，而不是谁的 “水军” 多谁就可以排名靠前；
      </p>
      <p>
        最后，如果有人喜欢了你的帖子，那么每个喜欢就可以让你收获一个团子。
        当然了，如果你想要喜欢别人的帖子，那么你需要消耗一个团子。
      </p>
    </div>
    <div class="control">
      <button @click="openCreatePost">发帖</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PostFlowList',
  async asyncData({ store, ctx }) {
    await Promise.all([
      store.dispatch('world/initData', {
        type: 'post',
        sort: 'active',
        ctx
      }),
      store.dispatch('world/getMeta', { type: 'post' })
    ])
  },
  data() {
    return {
      showTips: false
    }
  },
  computed: {
    meta() {
      return this.$store.state.world.post.meta
    }
  },
  methods: {
    openCreatePost() {
      if (!this.$store.state.login) {
        this.$channel.$emit('sign-in')
        return
      }
      this.$channel.$emit('drawer-open-write-post')
    }
  }
}
</script>
