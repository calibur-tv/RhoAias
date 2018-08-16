<style lang="scss">
#bangumi-timeline {
  #collections {
    padding-top: 10px;
    padding-bottom: 5px;

    .collection {
      display: block;

      $bangumi-height: 60px;
      .bangumi {
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
}
</style>

<template>
  <div id="bangumi-timeline">
    <div class="tabs">
      <a :href="$alias.bangumiNews">新番放送</a>
      <a 
        :href="$alias.bangumiTimeline" 
        class="active">时间轴</a>
      <a :href="$alias.bangumiTag()">分类索引</a>
    </div>
    <ul 
      id="collections" 
      class="container">
      <ul 
        v-for="col in timeline.list" 
        :key="col.date" 
        class="collection">
        <h3 
          class="sub-title" 
          v-text="col.date"/>
        <li 
          v-for="item in col.list" 
          :key="item.id" 
          class="bangumi">
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
    </ul>
    <more-btn
      :no-more="timeline.noMore"
      :loading="loading"
      @fetch="loadMore"
    />
  </div>
</template>

<script>
export default {
  name: "BangumiTime",
  async asyncData({ store, ctx }) {
    await store.dispatch("bangumi/getTimeline", ctx);
  },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    timeline() {
      return this.$store.state.bangumi.timeline;
    }
  },
  methods: {
    async loadMore() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      try {
        await this.$store.dispatch("bangumi/getTimeline");
      } catch (e) {
        this.$toast.error(e);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
