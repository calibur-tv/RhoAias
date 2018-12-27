<style lang="scss">
#score-show {
  .score-header {
    margin-top: 15px;

    .title {
      font-size: 24px;
      line-height: 32px;
      margin-bottom: 10px;
      margin-top: 0;
      font-weight: normal;
      @extend %breakWord;
    }

    .author-info {
      .total {
        float: right;
        font-weight: bold;
        font-size: 23px;
        letter-spacing: 1px;
        margin-left: 10px;
        color: #ff9900;
      }

      .author {
        overflow: hidden;
        line-height: 16px;
        font-size: 12px;
        margin-bottom: $container-padding;

        .avatar {
          margin-right: 10px;
          display: inline-block;
          vertical-align: middle;
        }
      }
    }

    .star-row {
      font-size: 0;
      margin-bottom: $container-padding;

      .star-item {
        display: inline-block;
        width: 50%;
        height: 36px;
        margin-bottom: 10px;

        .label {
          font-size: 12px;
          margin-bottom: 3px;
          color: $color-text-normal;
        }
      }
    }
  }

  .score-body {
    margin-bottom: 30px;
    font-size: 16px;
    color: #222;
    line-height: 30px;
    @extend %breakWord;
  }

  .score-footer {
    text-align: center;
    margin-bottom: 30px;

    .score-like-btn {
      @include btn-empty(#ffffff, #fa5555);
    }

    .score-liked-btn {
      @include btn-empty(#fa5555);
    }
  }

  .control {
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
    <v-img
      v-if="info.banner"
      :src="info.banner.url"
      :width="info.banner.width"
      :height="info.banner.height"
      :full="true"
      :lazy="false"
    />
    <div class="score-header container">
      <h1
        class="title" 
        v-text="info.title"/>
      <div class="author-info">
        <div class="total">{{ info.total }}分</div>
        <div class="author">
          <a
            :href="$alias.user(user.zone)"
            target="_blank"
          >
            <div class="avatar">
              <v-img
                :src="user.avatar"
                :avatar="true"
                size="25"
              />
            </div>
            <span
              class="name"
              v-text="user.nickname"
            />
          </a>
          ·
          <v-time v-model="info.published_at"/>
          ·
          <v-popover
            :report-id="info.id"
            :is-creator="info.is_creator"
            report-type="score"
          >
            <button class="tool-btn">举报</button>
          </v-popover>
        </div>
      </div>
      <div class="star-row">
        <div
          v-for="(item, index) in columns"
          :key="index"
          class="star-item"
        >
          <div
            class="label"
            v-text="`${labelMap[item]}：${info[item] * 2}分`"
          />
          <el-rate
            v-model="info[item]"
            disabled
            allow-half
          />
        </div>
      </div>
    </div>
    <div class="score-body">
      <json-content :content="info.content"/>
    </div>
    <div class="score-footer">
      <social-panel
        :id="info.id"
        :is-creator="info.is_creator"
        :user-id="user.id"
        :liked="info.liked"
        :marked="info.marked"
        :rewarded="info.rewarded"
        :reward-users="info.reward_users"
        :mark-users="info.mark_users"
        :like-users="info.like_users"
        type="score"
      />
    </div>
    <div 
      v-if="isMine" 
      class="control container">
      <button @click="deleteScore">删除</button>
      <a :href="$alias.editScore(info.id)">
        <button>编辑</button>
      </a>
    </div>
    <div class="container">
      <comment-main
        :id="info.id"
        :master-id="user.id"
        type="score"
      />
    </div>
    <div class="hr"/>
    <div class="container bangumi-panel">
      <h3 class="sub-title">所属番剧：</h3>
      <bangumi-panel
        :id="bangumi.id"
        :avatar="bangumi.avatar"
        :name="bangumi.name"
        :followed="bangumi.followed"
        @follow="handleBangumiFollow"
      >
        <p 
          class="summary" 
          v-text="bangumi.summary"/>
      </bangumi-panel>
    </div>
  </div>
</template>

<script>
import ToggleApi from '~/api/toggleApi'
import ScoreApi from '~/api/scoreApi'
import CommentMain from '~/components/comments/CommentMain'
import JsonContent from '~/components/jsonEditor/JsonContent'
import SocialPanel from '~/components/common/SocialPanel'
import BangumiPanel from '~/components/panel/BangumiPanel'
import VPopover from '~/components/common/Popover'
import { Rate } from 'element-ui'

export default {
  name: 'ScoreShow',
  async asyncData({ store, route, ctx }) {
    const id = route.params.id
    await Promise.all([
      store.dispatch('score/getShow', {
        ctx,
        id
      }),
      store.dispatch('comment/getMainComments', {
        ctx,
        id,
        type: 'score'
      })
    ])
  },
  head() {
    return {
      title: this.info.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `写给《${this.bangumi.name}》的漫评`
        }
      ]
    }
  },
  components: {
    CommentMain,
    JsonContent,
    SocialPanel,
    BangumiPanel,
    VPopover,
    'el-rate': Rate
  },
  data() {
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
    return {
      labelMap,
      columns: Object.keys(labelMap),
      loadingToggleLike: false
    }
  },
  computed: {
    info() {
      const result = {}
      Object.keys(this.$store.state.score.show).forEach(key => {
        const value = this.$store.state.score.show[key]
        result[key] = this.columns.indexOf(key) !== -1 ? +value : value
      })
      return result
    },
    bangumi() {
      return this.info.bangumi
    },
    user() {
      return this.info.user
    },
    currentUserId() {
      return this.$store.state.login ? this.$store.state.user.id : 0
    },
    isMine() {
      return this.currentUserId === this.user.id
    }
  },
  methods: {
    async toggleLike() {
      if (this.loadingToggleLike) {
        return
      }
      this.loadingToggleLike = true
      const api = new ToggleApi(this)
      try {
        const result = await api.like({
          type: 'score',
          id: this.info.id
        })
        this.$store.commit('score/LIKE_SCORE', result)
      } catch (e) {
        this.$toast.error(e)
      } finally {
        this.loadingToggleLike = false
      }
    },
    handleBangumiFollow(result) {
      this.$store.commit('score/FOLLOW_BANGUMI', result)
    },
    deleteScore() {
      this.$confirm('删除后无法找回, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const api = new ScoreApi(this)
          try {
            await api.delete({
              id: this.info.id
            })
            this.$toast.success('操作成功')
            setTimeout(() => {
              window.location.reload()
            }, 1000)
          } catch (e) {
            this.$toast.error(e)
          }
        })
        .catch(() => {})
    }
  }
}
</script>
