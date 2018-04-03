<style lang="scss">
  #bangumi-tags {
    .sub-title {
      margin-top: $container-padding;
    }

    #tags {
      li {
        float: left;
        margin-right: 8px;
        margin-bottom: 6px;
      }

      a {
        display: inline-block;
        padding: 0 5px;
        height: 24px;
        line-height: 22px;
        font-size: 12px;
        color: $color-pink-normal;
        border-radius: 4px;
        border: 1px solid $color-pink-normal;
        font-weight: 700;
      }

      .selected {
        background-color: $color-pink-deep;
        border-color: $color-pink-deep;
        color: #fff;
      }

      .btn {
        width: 100%;
        height: 30px;
        line-height: 28px;
        font-size: 13px;
        text-align: center;
        border: 1px solid #666;
        border-radius: 15px;
        margin: 5px 0 10px 0;
      }
    }

    #bangumis {
      $bangumi-height: 60px;
      li {
        margin-bottom: 10px;
        height: $bangumi-height;

        .face {
          width: $bangumi-height;
          height: $bangumi-height;
          flex-shrink: 0;
          margin-right: 15px;
          display: block;
          border-radius: 5px;
          float: left;
        }

        .content {
          overflow: hidden;

          .name {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 8px;
          }

          .body {
            color: $color-text-light;
            font-size: 13px;
            @include twoline(18px)
          }
        }
      }
    }
  }
</style>

<template>
  <div id="bangumi-tags">
    <div class="tabs">
      <router-link :to="$alias.bangumiNews">新番放送</router-link>
      <router-link :to="$alias.bangumiTimeline">时间轴</router-link>
      <a :href="$alias.bangumiTag()" class="active">分类索引</a>
    </div>
    <div class="container">
      <div id="tags">
        <h3 class="sub-title">标签列表</h3>
        <ul>
          <li
            v-for="(tag, index) in tags"
            :key="tag.id"
            @click="$store.commit('bangumi/selectTag', index)"
          >
            <a
              @click.prevent
              :href="$alias.bangumiTag(tag.id)" class="el-tag"
              :class="{ 'selected': tag.selected }"
              v-text="tag.name"
            ></a>
          </li>
          <button class="btn" @click="refresh">点击搜索</button>
        </ul>
      </div>
      <div id="bangumis" v-if="bangumis.length">
        <div class="hr"></div>
        <h3 class="sub-title">番剧列表</h3>
        <ul>
          <li v-for="item in bangumis" :key="item.id">
            <router-link :to="$alias.bangumi(item.id)">
              <v-img
                class="face"
                :title="item.name"
                :alt="item.name"
                :src="$resize(item.avatar, { width: 120 })">
              </v-img>
              <div class="content">
                <p class="name" v-text="item.name"></p>
                <p class="body" v-text="item.summary"></p>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <more-btn
      v-if="bangumis.length"
      :no-more="noMore"
      :loading="loading"
      :length="bangumis.length"
      @fetch="loadMore"
    ></more-btn>
  </div>
</template>

<script>
  export default {
    name: 'bangumi-tags',
    async asyncData ({ store, route, ctx }) {
      const id = route.query.id
      const arr = [store.dispatch('bangumi/getTags', { id, ctx })]
      if (id && (
          /^\d+$/.test(id) ||
          (id.indexOf('-') !== -1 && id.split('-').every(item => /^\d+$/.test(item)))
        )) {
        arr.push(store.dispatch('bangumi/getCategory', {
          id,
          ctx
        }))
      }
      await Promise.all(arr)
    },
    computed: {
      tags () {
        return this.$store.state.bangumi.tags
      },
      noMore () {
        return this.$store.state.bangumi.category.noMore
      },
      bangumis () {
        return this.$store.state.bangumi.category.data
      }
    },
    data () {
      return {
        loading: false
      }
    },
    methods: {
      refresh () {
        const selected = []
        this.tags.forEach((tag) => {
          if (tag.selected) {
            selected.push(tag.id)
          }
        })
        if (selected.length) {
          window.location = this.$alias.bangumiTag(selected.join('-'))
        }
      },
      async loadMore () {
        if (this.loading) {
          return
        }
        this.loading = true

        try {
          await this.$store.dispatch('bangumi/getCategory', {
            id: this.$route.query.id,
            ctx: this
          })
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>
