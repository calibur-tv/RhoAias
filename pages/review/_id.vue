<style lang="scss">
#score-show {
  .score-footer {
    text-align: center;
    margin-bottom: 30px;
  }

  .author-console {
    text-align: right;
    margin-bottom: 20px;

    button,
    a {
      font-size: 12px;
      color: $color-text-normal;
      margin-left: 5px;
    }
  }

  .bangumi-panel {
    padding-top: $container-padding;
    padding-bottom: $container-padding;

    .summary {
      font-size: 12px;
      color: #666;
      @include twoline(13px);
    }
  }
}
</style>

<template>
  <div id="score-show">
    <ScoreContent :info="info" />
    <div class="score-footer">
      <SocialPanel
        :id="info.id"
        :is-creator="info.is_creator"
        :is-mine="isMine"
        type="score"
      />
    </div>
    <div v-if="isMine" class="container author-console">
      <button @click="deleteScore">
        删除
      </button>
      <nuxt-link :to="$alias.editScore(info.id)">
        <button>编辑</button>
      </nuxt-link>
    </div>
    <div class="hr" />
    <div class="container bangumi-panel">
      <h3 class="sub-title">
        所属番剧：
      </h3>
      <BangumiPanel
        :id="bangumi.id"
        :avatar="bangumi.avatar"
        :name="bangumi.name"
      >
        <p class="summary" v-text="bangumi.summary" />
      </BangumiPanel>
    </div>
    <div class="hr" />
    <div class="container">
      <v-lazy>
        <CommentMain :id="info.id" :master-id="user.id" type="score" />
      </v-lazy>
    </div>
    <ShareBtn :share-data="share_data" />
  </div>
</template>

<script>
import CommentMain from '~/components/comments/CommentMain'
import ShareBtn from '~/components/common/ShareBtn'
import ScoreContent from '~/components/score/ScoreContent'
import SocialPanel from '~/components/common/SocialPanel'
import BangumiPanel from '~/components/panel/BangumiPanel'
import { getScoreInfo, deleteScore } from '~/api/scoreApi'

const labelMap = {
  lol: '笑点',
  cry: '泪点',
  fight: '燃点',
  moe: '萌点',
  sound: '音乐',
  vision: '画面',
  story: '情节',
  role: '人设',
  express: '内涵',
  style: '美感'
}
const columns = Object.keys(labelMap)

export default {
  name: 'ScoreShow',
  components: {
    SocialPanel,
    CommentMain,
    ScoreContent,
    BangumiPanel,
    ShareBtn
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      info: null,
      user: null,
      bangumi: null,
      share_data: null
    }
  },
  computed: {
    currentUserId() {
      return this.$store.state.login ? this.$store.state.user.id : 0
    },
    isMine() {
      return this.currentUserId === this.user.id
    }
  },
  asyncData({ app, store, params, query, error }) {
    const { id } = params
    const { hash, time } = query
    return getScoreInfo(app, { id, hash, time })
      .then(data => {
        const info = {}
        const { bangumi } = data
        Object.keys(data).forEach(key => {
          const value = data[key]
          info[key] = columns.indexOf(key) !== -1 ? +value : value
        })
        store.commit('social/SET_STATE', {
          type: 'score',
          id,
          data: {
            like: data.liked,
            reward: data.rewarded,
            mark: data.marked,
            like_users: data.like_users,
            mark_users: data.mark_users,
            reward_users: data.reward_users
          }
        })
        store.commit('social/SET_STATE', {
          type: 'bangumi',
          id: bangumi.id,
          data: {
            follow: bangumi.followed
          }
        })
        return {
          user: data.user,
          bangumi,
          info,
          share_data: data.share_data
        }
      })
      .catch(e => {
        error({
          statusCode: e.statusCode,
          message: e.message
        })
      })
  },
  head() {
    return {
      title: this.info.title,
      script: [
        {
          hid: 'share-data',
          innerHTML: JSON.stringify(this.share_data),
          type: 'application/json'
        }
      ]
    }
  },
  methods: {
    deleteScore() {
      this.$confirm('删除后无法找回, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            await deleteScore({
              id: this.info.id
            })
            this.$toast.success('操作成功')
            setTimeout(() => {
              window.location.reload()
            }, 1000)
          } catch (e) {
            // do nothing
          }
        })
        .catch(() => {})
    }
  }
}
</script>
