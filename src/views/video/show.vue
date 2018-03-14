<style lang="scss">
  #video-show {
    .video {
      width: 100%;
      height: 56vw;
      background-color: #000;
      color: #ffffff;
      text-align: center;
      position: relative;

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

      video {
        width: 100%;
        height: 100%;
      }

      button {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        color: #fff;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -40px;
        margin-top: -40px;
        overflow: hidden;
        background-color: rgba(255, 255, 255, .5);
        text-indent: 6px;
        font-size: 30px;
      }
    }

    .container {
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
        margin-bottom: 8px;
        overflow: hidden;
        position: relative;

        ul {
          margin-bottom: 2px;
        }

        .season-title {
          padding-bottom: 10px;
          margin-left: 2px;
        }

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
    <div class="video">
      <template v-if="bangumi.others_site_video">
        <p>应版权方要求，该视频暂不提供站内播放</p>
        <a :href="videoSrc" target="_blank">播放链接</a>
      </template>
      <template v-else-if="notSupport">
        <p>该视频格式暂不支持在 iOS Safari 浏览器上播放</p>
      </template>
      <template v-else>
        <video
          :src="videoSrc"
          :poster="video.poster"
          preload="metadata"
          ref="video"
        ></video>
        <button
          class="iconfont icon-bofang"
          v-if="!playing"
          @click="togglePlaying"
        >
        </button>
      </template>
    </div>
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
          <h3 class="sub-title">选集（{{ videos.length }}）</h3>
          <div class="more" v-if="showMoreBtn" @click="showAll = !showAll">{{ showAll ? '收起' : '展开' }}</div>
        </div>
        <template v-if="season && showAll">
          <template v-for="(metas, idx) in list">
            <h6 class="season-title" v-text="season.name[idx]"></h6>
            <ul>
              <li v-for="(meta, index) in metas.data" :key="meta.id">
                <a class="meta"
                   :class="{ 'router-link-active' : $route.params.id == meta.id }"
                   :href="$alias.video(meta.id)">
                  <span>第{{ videoPackage.list.repeat ? index + 1 : meta.part }}话</span>
                </a>
              </li>
            </ul>
          </template>
        </template>
        <ul v-else>
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
          { hid: 'keywords', name: 'keywords', content: `${this.bangumi.name}，第${this.video.part}话，${this.video.name}，在线观看 动画片大全 动漫在线播放 日本动漫 好看的动漫 二次元网站` }
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
      videoPackage () {
        return this.$store.state.video
      },
      video () {
        return this.videoPackage.info
      },
      list () {
        return this.videoPackage.list.videos
      },
      bangumi () {
        return this.videoPackage.bangumi
      },
      season () {
        return this.videoPackage.season
      },
      showMoreBtn () {
        return this.take < this.videos.length
      },
      videos () {
        if (!this.season) {
          return this.list
        }
        let result = []
        this.list.forEach(videos => {
          result = result.concat(videos.data)
        })
        return result
      },
      sortVideos () {
        const begin = (this.page - 1) * this.take
        return this.showAll ? this.videos : this.videos.slice(begin, begin + this.take)
      },
      videoSrc () {
        // return 'https://video.calibur.tv/bangumi/fullmetal-alchemist/video/720/81.Flv'
        return this.bangumi.others_site_video
          ? video.url
          : video.resource
            ? (
              video.resource.video[720] && video.resource.video[720].src
            ) || (
              video.resource.video[1080] && video.resource.video[1080].src
            ) || video.url
            : video.url
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
        firstPlay: true,
        player: null,
        playing: false,
        notSupport: false
      }
    },
    methods: {
      computePage () {
        this.videos.forEach((meta) => {
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
      },
      togglePlaying () {
        this.handlePlaying()
        if (this.playing) {
          this.player.pause()
          this.playing = false
        } else {
          this.player.play()
          this.playing = true
        }
      }
    },
    mounted () {
      this.computePage()
      if (this.isFlv) {
        if (this.$flvjs.isSupported()) {
          const flvPlayer = this.$flvjs.createPlayer({
            type: 'flv',
            url: this.videoSrc
          })
          flvPlayer.attachMediaElement(this.$refs.video)
          this.player = flvPlayer
        } else {
          this.notSupport = true
        }
      } else {
        this.player = this.$refs.video
        this.player.controls = false
      }
      this.player.load()
    }
  }
</script>
