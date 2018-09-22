<style lang="scss">
#bangumi-tags {
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

      .face {
        flex-shrink: 0;
        margin-right: 15px;
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
          @include twoline(18px);
        }
      }
    }
  }
}
</style>

<template>
  <div id="bangumi-tags">
    <div class="tabs">
      <a :href="$alias.bangumiNews">新番放送</a>
      <a :href="$alias.bangumiTimeline">时间轴</a>
      <a 
        :href="$alias.bangumiTag()" 
        class="active">分类索引</a>
    </div>
    <div class="container">
      <div id="tags">
        <h3 class="sub-title">
          标签列表
          <span
            class="tag-change"
            @click="choiceTags"
          >
            <i
              :style="{ transform: `rotate(${counter * 360}deg)` }"
              class="el-icon-refresh"
            />换一换
          </span>
        </h3>
        <ul>
          <li
            v-for="(tag, index) in tags"
            :key="tag.id"
            @click="$store.commit('bangumi/selectTag', index)"
          >
            <a
              :href="$alias.bangumiTag(tag.id)"
              :class="{ 'selected': tag.selected }" 
              @click.prevent
              v-text="tag.name"
            />
          </li>
          <button 
            class="btn" 
            @click="refresh">点击搜索</button>
        </ul>
      </div>
      <div 
        v-if="bangumis.length" 
        id="bangumis">
        <div class="hr"/>
        <h3 class="sub-title">番剧列表({{ total }})</h3>
        <ul>
          <li 
            v-for="item in bangumis" 
            :key="item.id">
            <a :href="$alias.bangumi(item.id)">
              <v-img
                :src="item.avatar"
                size="60"
                class="face"
              />
              <div class="content">
                <p 
                  class="name" 
                  v-text="item.name"/>
                <p 
                  class="body" 
                  v-text="item.summary"/>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <more-btn
      v-if="id"
      :no-more="noMore"
      :loading="loading"
      :length="bangumis.length"
      :auto="true"
      @fetch="loadMore"
    />
  </div>
</template>

<script>
export default {
  name: "BangumiTags",
  async asyncData({ store, route, ctx }) {
    const id = route.query.id;
    const arr = [store.dispatch("bangumi/getTags", { id, ctx })];
    if (
      id &&
      (/^\d+$/.test(id) ||
        (id.indexOf("-") !== -1 &&
          id.split("-").every(item => /^\d+$/.test(item))))
    ) {
      arr.push(
        store.dispatch("bangumi/getCategory", {
          id,
          ctx
        })
      );
    }
    await Promise.all(arr);
  },
  data() {
    return {
      loading: false,
      counter: 0
    };
  },
  computed: {
    id() {
      return this.$route.query.id;
    },
    tags() {
      const begin = this.counter * 8;
      const end = begin + 8;
      return this.$store.state.bangumi.tags.slice(begin, end);
    },
    resource() {
      return this.$store.state.bangumi.category;
    },
    noMore() {
      return this.resource.noMore;
    },
    bangumis() {
      return this.resource.list;
    },
    total() {
      return this.resource.total;
    }
  },
  methods: {
    choiceTags() {
      if ((this.counter + 1) * 8 >= this.$store.state.bangumi.tags.length) {
        this.counter = 0;
      } else {
        this.counter++;
      }
    },
    refresh() {
      const selected = [];
      this.tags.forEach(tag => {
        if (tag.selected) {
          selected.push(tag.id);
        }
      });
      if (selected.length) {
        window.location = this.$alias.bangumiTag(selected.join("-"));
      }
    },
    async loadMore() {
      if (this.loading) {
        return;
      }
      this.loading = true;

      try {
        await this.$store.dispatch("bangumi/getCategory", {
          id: this.$route.query.id,
          ctx: this
        });
      } catch (e) {
        this.$toast.error(e);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
