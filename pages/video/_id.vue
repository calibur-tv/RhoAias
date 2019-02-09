<style lang="scss">
#video-show {
  .video {
    width: 100%;
    height: 56vw;
    background-color: #000;
    color: #ffffff;
    text-align: center;
    position: relative;
    overflow: hidden;

    p {
      padding-top: 15vw;
    }

    a {
      display: inline-block;
      border-radius: 5px;
      border: 1px solid #fff;
      padding: 10px 15px;
      margin: 20px 5px 0;
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
      background-color: rgba(255, 255, 255, 0.5);
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

    .share-poster {
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
    }

    .need-coin-bg {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: #000;
      color: #ffffff;

      p {
        padding-top: 25vw;
      }
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
        margin-left: -4px;
        margin-right: -4px;
      }

      .season-title {
        padding-bottom: 10px;
        margin-left: 2px;
      }

      li {
        width: 25%;
        display: inline-block;
        text-align: center;
        margin-bottom: 10px;
        padding: 0 5px;
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
        border-color: $color-pink-normal;
        background-color: $color-pink-normal;
        color: $color-white;
      }
    }

    .social-panel {
      margin-top: 20px;
    }

    .bangumi-panel {
      margin-bottom: 15px;

      button {
        width: 100%;
        background-color: #f25d8e;
        border-radius: 4px;
        box-shadow: 0 4px 4px rgba(255, 112, 159, 0.3);
        color: #fff;
        font-size: 14px;
        line-height: 40px;
        padding: 0 24px;
        margin-bottom: 10px;

        &.active {
          background-color: #fff;
          color: #f25d8e;
          border: 1px solid #f25d8e;
        }
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

  .need-coin-drawer {
    text-align: center;
    border-radius: 10px 10px 0 0;

    h2 {
      margin-bottom: 20px;
      font-size: 13px;
      margin-top: 25px;
    }

    p,
    li {
      line-height: 24px;
    }

    a {
      color: $color-blue-normal;
    }

    ul {
      margin-top: 10px;
      margin-bottom: 15px;
      margin-left: 20px;
    }

    li {
      text-align: left;
      list-style-type: disc;
    }

    .invite-btn {
      width: 100%;
      background-color: #f25d8e;
      border-radius: 4px;
      box-shadow: 0 4px 4px rgba(255, 112, 159, 0.3);
      color: #fff;
      cursor: pointer;
      font-size: 14px;
      line-height: 50px;
      padding: 0 24px;
      margin-bottom: 5px;

      &:hover {
        background-color: #ff709f;
      }
    }
  }
}
</style>

<template>
  <div 
    id="video-show" 
    class="video-show">
    <div class="video">
      <template v-if="!videoSrc">
        <p>这个资源消失了_〆(´Д｀ )</p>
      </template>
      <template v-else-if="useOtherSiteSource">
        <template v-if="info.is_baidu_cloud">
          <p>该视频仅提供百度云播放</p>
          <a
            v-clipboard="videoSrc"
            href="javascript:;"
            @success="$toast.success('复制成功')"
          >点击复制链接</a>
          <a
            v-if="info.baidu_cloud_pwd"
            href="javascript:;"
          >密码：{{ info.baidu_cloud_pwd }}</a>
        </template>
        <template v-else>
          <p>应版权方要求 (⇀‸↼‶)，该视频暂不提供站内播放</p>
          <a
            :href="videoSrc"
            target="_blank">播放链接</a>
        </template>
      </template>
      <template v-else-if="notSupport">
        <p>该视频格式仅支持在电脑上播放 (눈_눈)</p>
      </template>
      <template v-else-if="isGuest">
        <p>流量压力太大了 (ಥ_ಥ)，需要登录才能看番</p>
        <a @click="$channel.$emit('sign-in', false)">立即登录</a>
      </template>
      <template v-else-if="ip_blocked">
        <p>
          你已被禁止看视频功能，请加QQ群解禁
        </p>
      </template>
      <template v-else-if="showLevelThrottle">
        <p>
          该视频需要你的等级至少 {{ need_min_level }} 才能播放
        </p>
        <a href="https://www.calibur.tv/post/2282">&nbsp;&nbsp;为什么要限流？</a>
        <a href="https://www.calibur.tv/post/2279">&nbsp;&nbsp;如何升级？</a>
      </template>
      <video
        v-else-if="info"
        ref="video"
        :src="videoSrc"
        :poster="info.poster"
        preload="none"
        controls="controls"
        controlsList="nodownload"
      />
      <img
        :src="$resize(info.poster, { width: 200 })"
        class="share-poster"
      >
      <div
        v-if="showRewardDialog"
        class="need-coin-bg"
      >
        <p>该视频需要投食之后才能播放</p>
      </div>
    </div>
    <div class="container">
      <div id="metas">
        <h3 class="sub-title">
          选集（{{ videos.length }}）
          <a
            v-if="nextPartVideo"
            :href="nextPartVideo"
            class="next">下一话</a>
          <div
            v-if="showMoreBtn"
            class="more"
            @click="showAll = !showAll">{{ showAll ? '收起' : '展开' }}</div>
        </h3>
        <template v-if="list.has_season && showAll">
          <div
            v-for="(items, idx) in list.videos"
            :key="idx"
          >
            <h6
              class="season-title"
              v-text="items.name"/>
            <ul>
              <li
                v-for="video in items.data"
                :key="video.id">
                <a
                  :class="{ 'a-active' : $route.params.id == video.id }"
                  :href="$alias.video(video.id)"
                  class="meta oneline"
                >
                  第{{ video.part - items.base }}话
                </a>
              </li>
            </ul>
          </div>
        </template>
        <ul v-else>
          <li
            v-for="video in sortVideos"
            :key="video.id">
            <a
              :class="{ 'a-active' : $route.params.id == video.id }"
              :href="$alias.video(video.id)"
              class="meta oneline"
            >
              第{{ video.part }}话
            </a>
          </li>
        </ul>
      </div>
      <social-panel
        :id="info.id"
        :is-creator="info.is_creator"
        :is-mine="isMine"
        type="video"
        @reward-callback="handleRewardAction"
      />
      <h3 class="sub-title">番剧简介</h3>
      <bangumi-panel
        v-if="bangumi"
        :id="bangumi.id"
        :avatar="bangumi.avatar"
        :name="bangumi.name"
        :show-follow="false"
        class="bangumi-panel"
      >
        <button
          :class="{ 'active': buyed }"
          @click="handleClickBuy"
        >{{ buyed ? '已承包' : '10个团子承包整个季度' }}</button>
      </bangumi-panel>
      <h3 class="sub-title">视频反馈</h3>
      <p class="tip">1：大家可以加入QQ群 <strong>106402736</strong>、<strong>806818950</strong> 获得最新的资源更新提醒</p>
      <p class="tip">2：安卓用户建议大家使用最新版 QQ 浏览器在线播放，不要使用系统自带的浏览器</p>
      <p class="tip">3：iOS用户建议使用自带的 Safari 播放</p>
      <div>
        <button
          class="video-report-btn"
          @click="handleVideoReportClick">视频报错</button>
      </div>
      <v-lazy>
        <comment-main
          :id="id"
          :master-id="info.user_id"
          type="video"
        />
      </v-lazy>
    </div>
    <!-- 付费弹窗 -->
    <v-drawer
      v-model="showRewardDialog"
      from="bottom"
      size="70%"
      class="need-coin-drawer"
    >
      <div
        v-if="!isGuest"
        class="container"
      >
        <h2>非常抱歉，为了降低流量压力，需要投食才能看番</h2>
        <p>点击视频下方「投食」按钮即可继续观看</p>
        <p>投食会消耗你一枚「团子」</p>
        <p>如果你已经没有团子了，你可以：</p>
        <ul>
          <li>每天签到可以获得一枚团子</li>
          <li>每天在站内发言、活跃就会获得团子</li>
          <li>邀请别人注册 calibur，你与注册者都会获得团子</li>
          <li>calibur 目前还不支持氪金，请见谅</li>
        </ul>
        <button
          v-clipboard="`http://calibur.tv/about/invite/${user.id}`"
          class="invite-btn"
          @success="$toast.success('复制成功~快去发送给好友吧')"
        >点击生成你的专属邀请码，获得团子</button>
      </div>
    </v-drawer>
    <share-btn :share-data="share_data"/>
  </div>
</template>

<script>
import { getVideoInfo, markPlaying, buyVideoPackage } from '~/api/videoApi'
import CommentMain from '~/components/comments/CommentMain'
import SocialPanel from '~/components/common/SocialPanel'
import BangumiPanel from '~/components/panel/BangumiPanel'
import ShareBtn from '~/components/common/ShareBtn'

export default {
  name: 'VideoShow',
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },
  async asyncData({ app, store, params, error }) {
    const { id } = params
    return getVideoInfo(app, { id })
      .then(data => {
        const { bangumi, info } = data
        store.commit('social/SET_STATE', {
          type: 'video',
          id,
          data: {
            like: info.liked,
            reward: info.rewarded,
            mark: info.marked,
            like_users: info.like_users,
            mark_users: info.mark_users,
            reward_users: info.reward_users
          }
        })
        store.commit('social/SET_STATE', {
          type: 'bangumi',
          id: bangumi.id,
          data: {
            follow: bangumi.followed
          }
        })
        return data
      })
      .catch(error)
  },
  components: {
    CommentMain,
    SocialPanel,
    BangumiPanel,
    ShareBtn
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  head() {
    const { bangumi, info, list } = this
    const hasSeason = list.has_season
    const bangumiName = bangumi.name
    const videoName = info.name
    let resultPart = info.part
    let seasonName = ''
    let title = ''
    if (hasSeason) {
      list.videos.forEach(videos => {
        videos.data.forEach(item => {
          if (item.id === info.id) {
            resultPart = item.part - videos.base
            seasonName = list.name
          }
        })
      })
    }
    if (seasonName) {
      if (seasonName === videoName) {
        title = `${bangumiName} : ${seasonName} - 视频`
      } else {
        title = `${bangumiName} : ${seasonName} : 第${resultPart}话 ${videoName} - 视频`
      }
    } else {
      title = `${bangumiName} : 第${resultPart}话 ${videoName} - 视频`
    }
    return {
      title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: bangumi.summary
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: `${bangumiName}，第${resultPart}话，${videoName}，在线观看 动画片大全 动漫在线播放 日本动漫 好看的动漫 二次元网站`
        }
      ]
    }
  },
  data() {
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
      loading: false,
      info: null,
      bangumi: null,
      list: [],
      ip_blocked: false,
      must_reward: false,
      need_min_level: 0,
      season_id: 0,
      buyed: false,
      buying: false,
      showRewardDialog: false,
      share_data: null
    }
  },
  computed: {
    isGuest() {
      return !this.$store.state.login
    },
    isMine() {
      return !this.isGuest
        ? this.info.user_id === this.$store.state.user.id
        : false
    },
    videos() {
      let result = []
      this.list.videos.forEach(videos => {
        result = result.concat(videos.data)
      })
      return result
    },
    sortVideos() {
      const begin = (this.page - 1) * this.take
      return this.showAll
        ? this.videos
        : this.videos.slice(begin, begin + this.take)
    },
    useOtherSiteSource() {
      return this.info.other_site
    },
    videoSrc() {
      return this.info.src
    },
    isFlv() {
      return this.useOtherSiteSource
        ? false
        : this.videoSrc
          ? this.videoSrc
              .split('?')[0]
              .split('.')
              .pop()
              .toLowerCase() === 'flv'
          : false
    },
    nextPartVideo() {
      let nextId = 0
      const currentId = +this.id
      this.videos.forEach((video, index) => {
        if (video.id === currentId && index !== this.videos.length - 1) {
          nextId = this.videos[index + 1].id
        }
      })
      return nextId ? this.$alias.video(nextId) : ''
    },
    showMoreBtn() {
      return this.take < this.videos.length
    },
    showLevelThrottle() {
      if (!this.isGuest) {
        return this.user.exp.level < this.need_min_level
      }
      return true
    },
    needCoin() {
      return this.must_reward && !this.info.rewarded
    },
    user() {
      return this.$store.state.user
    }
  },
  mounted() {
    this.computePage()
    const canceler = this.$watch('isGuest', () => {
      canceler()
      this.initPlayer()
    })
  },
  methods: {
    initPlayer() {
      if (this.isFlv) {
        this.notSupport = true
        return
      }
      if (
        !this.videoSrc ||
        this.useOtherSiteSource ||
        this.showLevelThrottle ||
        this.isGuest ||
        this.ip_blocked
      ) {
        return
      }
      this.player = this.$refs.video

      try {
        this.player.load()
      } catch (e) {
        this.$alert(this.errorTips)
        return
      }
      const self = this
      this.player.addEventListener('pause', () => {
        this.playing = false
      })

      this.player.addEventListener('waiting', () => {
        this.loading = true
      })

      this.player.addEventListener('playing', () => {
        this.playing = true
        this.handlePlaying()
      })

      this.player.addEventListener('timeupdate', function() {
        self.loading = false
        if (this.currentTime > 300 && self.needCoin) {
          self.player.pause()
          self.showRewardDialog = true
        }
      })

      this.player.addEventListener('abort', () => {
        this.$alert(this.errorTips)
      })

      this.player.addEventListener('error', () => {
        this.$alert(this.errorTips)
      })
    },
    computePage() {
      this.videos.forEach(meta => {
        if (meta.id === +this.id) {
          this.part = meta.part
        }
      })
      this.page = Math.ceil(this.part / this.take)
    },
    handlePlaying() {
      if (this.firstPlay) {
        this.loading = true
        this.firstPlay = false
        markPlaying(this, {
          id: this.id
        })
      }
    },
    handleVideoReportClick() {
      this.$channel.$emit('open-feedback', {
        type: 4,
        desc: `【H5】-《${this.bangumi.name}》第${
          this.part
        }话 视频有错误，错误详情为：{?}`,
        placeholder: '请填写错误详情'
      })
    },
    handleRewardAction() {
      if (this.must_reward) {
        window.location.reload()
      }
    },
    handleClickBuy() {
      if (this.buyed) {
        this.$toast.success('无需重复购买')
        return
      }
      if (this.buying) {
        return
      }
      this.$confirm('这会消耗你10个虚拟币，确认吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.buying = true
          buyVideoPackage(this, {
            season_id: this.season_id
          })
            .then(() => {
              this.$toast.success('购买成功，正在刷新页面').then(() => {
                window.location.reload()
              })
            })
            .catch(() => {
              this.buying = false
            })
        })
        .catch(() => {})
    }
  }
}
</script>
