<style lang="scss">
#bangumi-video-flow {
  .sub-title {
    margin-top: $container-padding;
  }

  .video {
    margin-bottom: 15px;

    a {
      display: block;
      width: 100%;
      height: 80px;
      @extend %clearfix;
    }

    &:first-child {
      margin-top: $container-padding;
    }

    .poster {
      margin-right: 10px;
      border-radius: 5px;
      float: left;
    }

    .intro {
      overflow: hidden;

      .part {
        font-size: 16px;
        line-height: 20px;
        margin-bottom: 5px;
      }

      .name {
        @include twoline(18px);
      }
    }
  }
}
</style>

<template>
  <div id="bangumi-video-flow">
    <section v-if="videos.total">
      <div
        v-if="videos.has_season"
        class="container">
        <template v-for="season in videos.list">
          <h3
            :key="season.name"
            class="sub-title"
            v-text="season.name"/>
          <ul :key="season.name">
            <li
              v-for="video in season.data"
              :key="video.id"
              class="video"
            >
              <a :href="$alias.video(video.id)">
                <v-img
                  :src="video.poster"
                  width="128"
                  height="80"
                  class="poster"
                />
                <div class="intro">
                  <p class="part oneline">第{{ video.part - season.base }}话</p>
                  <span
                    class="name"
                    v-text="video.name"/>
                </div>
              </a>
            </li>
          </ul>
        </template>
      </div>
      <ul
        v-else
        class="container">
        <li
          v-for="video in videos.list[0].data"
          :key="video.id"
          class="video"
        >
          <a :href="$alias.video(video.id)">
            <v-img
              :src="video.poster"
              width="128"
              height="80"
              class="poster"
            />
            <div class="intro">
              <p class="part oneline">第{{ video.part }}话</p>
              <span
                class="name"
                v-text="video.name"/>
            </div>
          </a>
        </li>
      </ul>
    </section>
    <more-btn
      v-else
      :no-more="true"
      :auto="true"
      :loading="loading"
      :length="videos.total"
    >
      <button @click="openFeedbackForResource">求资源</button>
    </more-btn>
  </div>
</template>

<script>
export default {
  name: "BangumiVideoFlow",
  data() {
    return {
      loading: false
    };
  },
  computed: {
    videos() {
      return this.$store.state.bangumi.videos;
    },
    info() {
      return this.$store.state.bangumi.info;
    }
  },
  created() {
    if (!this.videos.list.length) {
      this.getVideos();
    }
  },
  methods: {
    openFeedbackForResource() {
      this.$channel.$emit("open-feedback", {
        type: 5,
        desc: `我想看《${this.info.name}》的视频第 ? 集`
      });
    },
    async getVideos() {
      if (this.loading) {
        return;
      }
      this.loading = true;

      try {
        await this.$store.dispatch("bangumi/getVideos", {
          ctx: this,
          id: this.info.id
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
