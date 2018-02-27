<style lang="scss">
  #video-show {
    .video {
      width: 100%;
      min-height: 56vw;
      background-color: #000;
      color: #ffffff;
      text-align: center;

      p {
        padding-top: 20vw;
      }

      a {
        margin-top: 20px;
        display: inline-block;
        border-radius: 5px;
        border: 1px solid #fff;
        padding: 10px 15px;
      }
    }

    .container {
      background-color: #ffffff;

      #bangumi {
        margin-top: 20px;
        position: relative;
        @include border-bottom();
        padding-bottom: 20px;

        .avatar {
          display: block;
          float: left;
          width: 80px;
          height: 92px;
          border-radius: 5px;
          overflow: hidden;
          margin-right: 10px;
        }

        .info {
          overflow: hidden;
          min-height: 92px;

          .name {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            display: block;
          }
        }
      }

      #metas {
        margin-top: 20px;
        margin-bottom: 10px;
        overflow: hidden;
        position: relative;

        ul {
          margin-left: -10px;
          margin-right: -10px;
        }

        li {
          width: 25%;
          display: inline-block;
          text-align: center;
          margin-bottom: 10px;
          padding: 0 10px;
        }

        .meta {
          border: 1px solid $color-gray-deep;
          height: 30px;
          color: $color-link;
          border-radius: 4px;
          display: block;
          font-size: 12px;
          line-height: 28px;

          span {
            min-width: 16px;
            display: inline-block;
            text-align: right;
          }

          &:hover {
            border-color: $color-blue-light;
            background-color: $color-blue-light;
            color: $color-white;
          }
        }

        .router-link-active {
          border-color: $color-blue-light;
          background-color: $color-blue-light;
          color: $color-white;
        }

        .more {
          position: absolute;
          right: 0;
          top: 0;
          text-align: center;
          font-size: 14px;
          color: $color-text-normal;
        }
      }
    }
  }
</style>

<template>
  <div id="video-show">
    <div class="video" v-if="bangumi.others_site_video">
      <p>应版权方要求，该视频暂不提供站内播放</p>
      <a :href="videoSrc" target="_blank">播放链接</a>
    </div>
    <video
      class="video"
      :src="videoSrc"
      :poster="video.poster"
      preload="metadata"
      controls
      controlsList="nodownload"
      @playing="handlePlaying"
      ref="video"
      v-else
    ></video>
    <div class="container">
      <div id="bangumi">
        <router-link class="avatar" :to="$alias.bangumi(bangumi.id)">
          <img :src="$resize(bangumi.avatar, { width: 80, height: 92 })">
        </router-link>
        <div class="info">
          <router-link
            class="name"
            :to="$alias.bangumi(bangumi.id)"
            v-text="bangumi.name"
          ></router-link>
          <p>第{{ video.part }}话&nbsp;{{ video.name }}</p>
        </div>
      </div>
      <div id="metas">
        <div>
          <h3 class="sub-title">选集（{{ list.length }}）</h3>
          <div class="more" v-if="take < list.length" @click="showAll = !showAll">{{ showAll ? '收起' : '展开' }}</div>
        </div>
        <ul>
          <li v-for="meta in sortVideos" :key="meta.id">
            <a class="meta"
               :class="{ 'router-link-active' : $route.params.id == meta.id }"
               :href="$alias.video(meta.id)">
              <span>第{{ meta.part }}话</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import VideoApi from '~/api/videoApi'

  export default {
    name: 'video-show',
    head () {
      return {
        title: `${this.bangumi.name} : 第${this.video.part}话 ${this.video.name} - 视频`,
        meta: [
          { hid: 'description', name: 'description', content: this.bangumi.summary },
          { hid: 'keywords', name: 'keywords', content: `${this.bangumi.name}，第${this.video.part}话，${this.video.name}` }
        ]
      }
    },
    async asyncData ({ route, store, ctx }) {
      await store.dispatch('video/getShow', {
        id: route.params.id,
        ctx
      })
    },
    computed: {
      id () {
        return parseInt(this.$route.params.id, 10)
      },
      video () {
        return this.$store.state.video.info
      },
      list () {
        return this.$store.state.video.list.videos
      },
      bangumi () {
        return this.$store.state.video.bangumi
      },
      sortVideos () {
        const begin = (this.page - 1) * this.take
        const metas = this.$utils.orderBy(this.list, 'part')
        return this.showAll ? metas : metas.slice(begin, begin + this.take)
      },
      videoSrc () {
        return 'https://video.calibur.tv/bangumi/cowboy-bebop/video/720/1.Flv'
//        return this.bangumi.others_site_video
//          ? this.video.url
//          : this.video.resource
//            ? this.video.resource.video[720].src || this.video.url
//            : this.video.url
      },
      isFlv () {
        return this.bangumi.others_site_video
          ? false
          : this.videoSrc.split('.').pop().toLowerCase() === 'flv'
      }
    },
    data () {
      return {
        maxWidth: 0,
        take: 4,
        part: 0,
        page: 0,
        showAll: false,
        firstPlay: true
      }
    },
    methods: {
      computePage () {
        this.list.forEach((meta) => {
          if (meta.id === this.id) {
            this.part = meta.part
          }
        })
        this.page = Math.ceil(this.part / this.take)
      },
      handlePlaying () {
        if (this.firstPlay) {
          this.firstPlay = false
          const api = new VideoApi(this)
          api.playing(this.id)
        }
      }
    },
    mounted () {
      this.computePage()
      if (this.isFlv && this.$flvjs.isSupported()) {
        const flvPlayer = this.$flvjs.createPlayer({
          type: 'flv',
          url: this.videoSrc
        })
        flvPlayer.attachMediaElement(this.$refs.video)
      }
    }
  }
</script>
