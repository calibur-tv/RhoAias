<style lang="scss">
  #bangumi-video-flow {
    .sub-title {
      margin-top: $container-padding;
    }

    .video {
      margin-bottom: 15px;
      width: 100%;
      display: block;

      &:first-child {
        margin-top: $container-padding;
      }

      img {
        width: 128px;
        height: 80px;
        border-radius: 5px;
        margin-right: 10px;
        float: left;
      }

      figcaption {
        overflow: hidden;

        .name {
          @include twoline(18px)
        }
      }

      p {
        font-size: 16px;
        line-height: 20px;
        margin-bottom: 5px;
      }
    }
  }
</style>

<template>
  <div id="bangumi-video-flow">
    <div v-if="videos.has_season" class="container">
      <template v-for="season in videos.list">
        <h3 class="sub-title" v-text="season.name" :key="season.name"></h3>
        <ul :key="season.name">
          <li
            v-for="(video, index) in season.data"
            :key="video.id"
            class="video"
          >
            <a :href="$alias.video(video.id)">
              <figure class="clearfix">
                <v-img
                  class="bg"
                  :alt="video.name"
                  :src="$resize(video.poster, { width: 128, height: 80 })"
                ></v-img>
                <figcaption>
                  <p class="part oneline">第{{ video.part - season.base }}话</p>
                  <span class="name" v-text="video.name"></span>
                </figcaption>
              </figure>
            </a>
          </li>
        </ul>
      </template>
    </div>
    <ul class="container" v-else>
      <li
        v-for="video in videos.list"
        :key="video.id"
        class="video"
      >
        <a :href="$alias.video(video.id)">
          <figure class="clearfix">
            <v-img
              class="bg"
              :alt="video.name"
              :src="$resize(video.poster, { width: 128, height: 80 })"
            ></v-img>
            <figcaption>
              <p class="part oneline">第{{ video.part }}话</p>
              <span class="name" v-text="video.name"></span>
            </figcaption>
          </figure>
        </a>
      </li>
    </ul>
    <more-btn
      :no-more="true"
      :auto="true"
      :loading="loading"
      :length="videos.list.length"
    >
      <button @click="openFeedbackForResource">求资源</button>
    </more-btn>
  </div>
</template>

<script>
  export default {
    name: 'bangumi-video-flow',
    computed: {
      videos () {
        return this.$store.state.bangumi.videos
      },
      info () {
        return this.$store.state.bangumi.info
      }
    },
    data () {
      return {
        loading: false
      }
    },
    created () {
      if (!this.videos.list.length) {
        this.getVideos()
      }
    },
    methods: {
      openFeedbackForResource () {
        this.$channel.$emit('open-feedback', {
          type: 5,
          desc: `我想看《${this.info.name}》的视频第 ? 集`
        })
      },
      async getVideos () {
        if (this.loading) {
          return
        }
        this.loading = true

        try {
          await this.$store.dispatch('bangumi/getVideos', {
            ctx: this,
            id: this.info.id
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
