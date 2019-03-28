<style lang="scss">
#bangumi-tag {
  .sub-title {
    margin-top: 10px;

    .tag-change {
      float: right;
      color: $color-text-light;
      font-size: 13px;
      line-height: 16px;

      i {
        display: inline-block;
        line-height: 1;
        transition: 0.5s ease;
        margin-right: 3px;
      }
    }
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
      .bangumi-a {
        display: flex;
        .face {
          flex-shrink: 0;
          height: 60px !important;
          width: 60px !important;
          margin-right: 10px;
          border-radius: 5px;
        }

        .content {
          overflow: hidden;

          .name {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 4px;
            margin-top: 1px;
          }

          .body {
            color: $color-text-light;
            font-size: 13px;
            @include twoline(18px);
          }
        }
      }
    }
  }
}
</style>

<template>
  <div id="bangumi-tag" class="container">
    <div id="tags">
      <h3 class="sub-title">
        标签列表
        <span class="tag-change" @click="choiceTags">
          <i
            :style="{ transform: `rotate(${counter * 360}deg)` }"
            class="el-icon-refresh"
          />换一换
        </span>
      </h3>
      <ul>
        <li v-for="tag in tagsList" :key="tag.id" @click="selectTag(tag)">
          <a
            :class="{ selected: tag.selected }"
            @click.prevent
            v-text="tag.name"
          />
        </li>
        <button class="btn" @click="loadBangumis">
          点击搜索
        </button>
      </ul>
    </div>
    <div v-if="bangumis.total" id="bangumis">
      <div class="hr" />
      <h3 class="sub-title">
        番剧列表({{ bangumis.total }})
      </h3>
      <ul>
        <li v-for="item in bangumis.data" :key="item.id">
          <nuxt-link :to="$alias.bangumi(item.id)" class="bangumi-a">
            <v-img :src="item.avatar" width="60" height="60" class="face" />
            <div class="content">
              <p class="name" v-text="item.name" />
              <p class="body" v-text="item.summary" />
            </div>
          </nuxt-link>
        </li>
      </ul>
    </div>
    <more-btn
      v-if="moreBtnShow"
      :no-more="bangumis.noMore"
      :length="bangumis.data.length"
      :loading="loading"
      :auto="true"
      @fetch="loadBangumis"
    />
  </div>
</template>

<script>
import { getAllBangumiTag, getCategoryBangumis } from '~/api/bangumiApi'

export default {
  name: 'BangumiTags',
  data() {
    return {
      loading: false,
      bangumis: {
        data: [],
        noMore: false,
        page: 0,
        take: 10,
        total: 0
      },
      tags: [],
      counter: 0
    }
  },
  computed: {
    moreBtnShow() {
      return this.tags
        .filter(_ => _.selected)
        .map(_ => _.id)
        .join('-')
    },
    showEmpty() {
      return (
        (this.tags.some(_ => _.selected) && !this.loading) ||
        this.tags.every(_ => !_.selected)
      )
    },
    tagsList() {
      const begin = this.counter * 8
      const end = begin + 8
      return this.tags.slice(begin, end)
    }
  },
  async asyncData({ app }) {
    const data = await getAllBangumiTag(app)
    return {
      tags: data.map(_ => {
        return Object.assign(_, {
          selected: false
        })
      })
    }
  },
  head: {
    title: '动画标签'
  },
  methods: {
    selectTag(tag) {
      if (this.loading) {
        return
      }
      tag.selected = !tag.selected
      this.bangumis = {
        data: [],
        noMore: false,
        page: 0,
        take: 10,
        total: 0
      }
    },
    async loadBangumis() {
      if (this.loading || this.bangumis.noMore) {
        return
      }
      const tags = this.tags
        .filter(_ => _.selected)
        .map(_ => _.id)
        .join('-')
      this.loading = true
      try {
        const data = await getCategoryBangumis(this, {
          page: this.bangumis.page,
          take: this.bangumis.take,
          tags
        })
        this.bangumis.data = this.bangumis.data.concat(data.list)
        this.bangumis.noMore = data.noMore
        this.bangumis.total = data.total
        this.bangumis.page++
      } finally {
        this.loading = false
      }
    },
    choiceTags() {
      if ((this.counter + 1) * 8 >= this.tags.length) {
        this.counter = 0
      } else {
        this.counter++
      }
    }
  }
}
</script>
