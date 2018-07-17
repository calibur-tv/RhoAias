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

      .play-btn {
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

      .video-loading {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        color: #fff;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -40px;
        margin-top: -40px;
        background-color: transparent;
        font-size: 30px;
        line-height: 80px;
        animation: rolling 1s infinite linear;
      }
    }

    .container {
      #metas {
        margin-bottom: 8px;
        overflow: hidden;
        position: relative;

        .sub-title {
          margin-top: 15px;

          .next {
            float: right;
            font-size: 13px;
            margin-left: 15px;
            color: $color-text-normal;
          }

          .more {
            float: right;
            font-size: 13px;
            margin-left: 15px;
            color: $color-text-normal;
          }
        }

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
        }

        .a-active {
          border-color: $color-blue-light;
          background-color: $color-blue-light;
          color: $color-white;
        }
      }

      .bangumi-panel {
        margin-bottom: 15px;

        .part {
          font-size: 14px;
          display: block;
          @include twoline(16px)
        }
      }

      .tip {
        font-size: 12px;
        color: $color-text-normal;
        margin-bottom: 5px;
        line-height: 15px;
      }

      .video-report-btn {
        width: 100%;
        height: 30px;
        line-height: 28px;
        font-size: 13px;
        text-align: center;
        border: 1px solid #666;
        border-radius: 15px;
        margin-bottom: 15px;
        margin-top: 3px;
      }
    }
  }
</style>

<template>
  <div id="video-show">
    <div class="video">
      <template v-if="useOtherSiteSource">
        <p>应版权方要求 (⇀‸↼‶)，该视频暂不提供站内播放</p>
        <a :href="videoSrc" target="_blank">播放链接</a>
      </template>
      <template v-else-if="notSupport">
        <p>该视频格式仅支持在电脑上播放 (눈_눈)</p>
      </template>
      <template v-else-if="isGuest">
        <p>流量压力太大了 (ಥ_ಥ)，需要登录才能看番</p>
        <a @click="$channel.$emit('sign-in', false)">立即登录</a>
      </template>
      <template v-else-if="video">
        <video
          :src="videoSrc"
          :poster="video.poster"
          preload="none"
          ref="video"
          controlsList="nodownload"
        ></video>
        <button
          class="play-btn iconfont icon-bofang"
          v-if="!playing"
          @click="togglePlaying"
        ></button>
        <div v-if="loading" class="video-loading iconfont icon-jiazailoading-A">
        </div>
      </template>
    </div>
    <div class="container">
      <div id="metas">
        <h3 class="sub-title">
          选集（{{ videos.length }}）
          <a class="next" :href="nextPartVideo" v-if="nextPartVideo">下一话</a>
          <div class="more" v-if="showMoreBtn" @click="showAll = !showAll">{{ showAll ? '收起' : '展开' }}</div>
        </h3>
        <template v-if="season && showAll">
          <template v-for="(videos, idx) in list">
            <h6 class="season-title" v-text="season.name[idx]"></h6>
            <ul>
              <li v-for="(video, index) in videos.data" :key="video.id">
                <a
                  class="meta oneline"
                  :class="{ 'a-active' : $route.params.id == video.id }"
                  :href="$alias.video(video.id)"
                >
                  第{{ video.part - videos.base }}话
                </a>
              </li>
            </ul>
          </template>
        </template>
        <ul v-else>
          <li v-for="video in sortVideos" :key="video.id">
            <a
              class="meta oneline"
              :class="{ 'a-active' : $route.params.id == video.id }"
              :href="$alias.video(video.id)"
            >
              第{{ video.part }}话
            </a>
          </li>
        </ul>
      </div>
      <h3 class="sub-title">番剧简介</h3>
      <v-bangumi-panel
        class="bangumi-panel"
        v-if="bangumi"
        :id="bangumi.id"
        :avatar="bangumi.avatar"
        :name="bangumi.name"
        :followed="bangumi.followed"
        @follow="handleBangumiFollow"
      >
        <p class="part">第{{ video.part }}话&nbsp;{{ video.name }}</p>
      </v-bangumi-panel>
      <h3 class="sub-title">视频反馈</h3>
      <p class="tip">1：大家可以加入QQ群 <strong>806818950</strong> 获得最新的资源更新提醒</p>
      <p class="tip">2：安卓用户建议大家使用最新版 QQ 或 UC 浏览器在线播放，不要使用系统自带的浏览器</p>
      <div>
        <button class="video-report-btn" @click="handleVideoReportClick">视频报错</button>
      </div>
      <comment-main
        :id="id"
        :master-id="video.user_id"
        type="video"
      ></comment-main>
    </div>
  </div>
</template>

<script>
  import VideoApi from '~/api/videoApi'
  import CommentMain from '~/components/comments/CommentMain'

  export default {
    name: 'video-show',
    head () {
      const bangumi = this.bangumi
      const video = this.video
      if (!bangumi || !video) {
        return
      }
      return {
        title: `${bangumi.name} : 第${video.part}话 ${video.name} - 视频`,
        meta: [
          { hid: 'description', name: 'description', content: bangumi.summary },
          { hid: 'keywords', name: 'keywords', content: `${bangumi.name}，第${video.part}话，${video.name}，在线观看 动画片大全 动漫在线播放 日本动漫 好看的动漫 二次元网站` }
        ]
      }
    },
    async asyncData ({ route, store, ctx }) {
      const id = route.params.id
      await Promise.all([
        store.dispatch('video/getShow', { id, ctx }),
        store.dispatch('comment/getMainComments', {
          ctx,
          id,
          type: 'video',
          seeReplyId: route.query.reply
        })
      ])
    },
    components: {
      CommentMain
    },
    computed: {
      id () {
        return parseInt(this.$route.params.id, 10)
      },
      isGuest () {
        return !this.$store.state.login
      },
      videoPackage () {
        return this.$store.state.video
      },
      video () {
        return this.videoPackage.info
      },
      list () {
        return this.videoPackage.list ? this.videoPackage.list.videos : []
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
      useOtherSiteSource () {
        if (!this.bangumi) {
          return false
        }
        if (this.bangumi.others_site_video) {
          return true
        }
        const resource = this.video.resource
        if (!resource) {
          return true
        }
        return !((
          resource.video[720] && resource.video[720].src
        ) || (
          resource.video[1080] && resource.video[1080].src
        ))
      },
      videoSrc () {
        const video = this.video
        if (!video) {
          return ''
        }
        return this.useOtherSiteSource
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
        return this.useOtherSiteSource
          ? false
          : this.videoSrc ? this.videoSrc.split('?')[0].split('.').pop().toLowerCase() === 'flv' : false
      },
      nextPartVideo () {
        let nextId = 0
        this.videos.forEach((video, index) => {
          if (video.id === this.id && index !== this.videos.length - 1) {
            nextId = this.videos[index + 1].id
          }
        })
        return nextId ? this.$alias.video(nextId) : ''
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
        notSupport: false,
        loading: false
      }
    },
    methods: {
      handleBangumiFollow (result) {
        this.$store.commit('video/followBangumi', {
          result
        })
      },
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
          this.loading = true
          this.firstPlay = false
          const api = new VideoApi(this)
          api.playing(this.id)
        }
      },
      togglePlaying () {
        try {
          this.handlePlaying()
          if (this.playing) {
            this.player.pause()
            this.playing = false
          } else {
            this.player.play()
            this.playing = true
          }
        } catch (e) {
          this.$alert('视频加载失败，建议使用QQ浏览器播放！')
        }
      },
      handleVideoReportClick () {
        this.$channel.$emit('open-feedback', {
          type: 4,
          desc: `【H5】-《${this.bangumi.name}》第${this.part}话 视频有错误，错误详情为：`
        })
      },
      downloadVideo () {
        if (this.useOtherSiteSource) {
          this.$toast.error('第三方资源不支持下载')
          return
        }
        if (this.isGuest) {
          this.$toast.error('登录后才能下载')
          this.$channel.$emit('sign-in')
          return
        }
        this.$alert('该视频资源6小时内有效，请在失效前下载至本地').then(() => {
          window.open(this.videoSrc)
        })
      }
    },
    mounted () {
      this.computePage()
      if (this.isFlv) {
        this.notSupport = true
        return
      }
      if (this.useOtherSiteSource) {
        return
      }
      if (this.isGuest) {
        return
      }
      this.player = this.$refs.video
      this.player.controls = false
      try {
        this.player.load()
      } catch (e) {
        this.$alert('视频加载失败，建议使用QQ浏览器播放！')
        return
      }
      this.player.addEventListener('pause', () => {
        this.playing = false
      })

      this.player.addEventListener('timeupdate', () => {
        this.loading = false
      })

      this.player.addEventListener('abort', () => {
        this.$alert('视频加载失败，建议使用QQ浏览器播放！')
      })

      this.player.addEventListener('error', () => {
        this.$alert('视频加载失败，建议使用QQ浏览器播放！')
      })
    }
  }
</script>
