<style lang="scss">
#bangumi-timeline {
  .sub-title {
    margin-top: 10px;
  }

  #collections {
    padding-bottom: 5px;

    .collection {
      display: block;

      $bangumi-height: 60px;
      .bangumi {
        margin-bottom: 10px;
        height: $bangumi-height;
        .bangumi-a {
          display: flex;
          .face {
            margin-right: 10px;
            border-radius: 5px;
            width: 60px !important;
            height: 60px !important;
          }

          .content {
            flex: 1;
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
}
</style>

<template>
  <div id="bangumi-timeline">
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
          <nuxt-link
            :to="$alias.bangumi(item.id)"
            class="bangumi-a">
            <v-img
              :src="item.avatar"
              width="60"
              height="60"
              class="face"
            />
            <div class="content">
              <p 
                class="name oneline"
                v-text="item.name"/>
              <p 
                class="body" 
                v-text="item.summary"/>
            </div>
          </nuxt-link>
        </li>
      </ul>
    </ul>
    <more-btn
      :no-more="timeline.noMore"
      :loading="loading"
      :auto="true"
      @fetch="loadMore"
    />
  </div>
</template>

<script>
export default {
  name: 'BangumiTime',
  async asyncData(ctx) {
    await ctx.store.dispatch('bangumi/getTimeline')
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    timeline() {
      return this.$store.state.bangumi.timeline
    }
  },
  methods: {
    async loadMore() {
      if (this.loading) {
        return
      }
      this.loading = true
      try {
        await this.$store.dispatch('bangumi/getTimeline')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
