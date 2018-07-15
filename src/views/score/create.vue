<style lang="scss">
  #score-create {
    .bangumi-search {
      margin-bottom: 20px;
    }

    .field {
      font-size: 13px;
      line-height: 48px;
      margin-top: -15px;
      @extend %clearfix;

      span {
        float: left;
      }

      div {
        color: #000;
        overflow: hidden;
      }
    }

    .star-title {
      span {
        float: left;
      }

      .collapsed-icon {
        float: right;
        height: 24px;
        padding: 0 5px;
        margin-top: -4px;
        margin-right: -5px;
      }

      .tips-btn {
        overflow: hidden;
        padding: 0 5px;
      }

      i {
        color: $color-text-light;
      }
    }

    .el-alert {
      background-color: #f4f4f5;
      color: #909399;
      padding: 8px 16px;
      border-radius: 4px;
      margin-bottom: 20px;

      p {
        margin-bottom: 5px;
        font-size: 13px;
        line-height: 18px;
      }
    }

    .star-row {
      @extend %clearfix;

      .star-item {
        margin-bottom: 15px;

        .label {
          font-size: 14px;
          line-height: 22px;
          color: $color-text-normal;
          float: left;
        }
      }
    }
  }
</style>

<template>
  <div id="score-create">
    <h3 class="sub-title">选择番剧</h3>
    <bangumi-picker
      v-model="bangumiId"
      class="field"
    />
    <h3 class="sub-title star-title">
      <span>各项分值</span>
      <button class="tips-btn" @click="openTips = !openTips">
        <i class="el-icon-question"/>
      </button>
      <button class="collapsed-icon" @click="collapsed = !collapsed">
        <i :class="[ collapsed ? 'el-icon-arrow-left' : 'el-icon-arrow-down' ]"/>
      </button>
    </h3>
    <div
      v-if="openTips"
      class="el-alert"
    >
      <p>漫评系统简介：</p>
      <p>站长本人只能算是一个中度的动漫爱好者，对历史的动漫评分体系并没有做过深刻的研究，并且文学功底很差，因此实现的这个评分系统并不一定完美，如果你有好的意见可以通过QQ群联系到我向我反馈。</p>
      <p>评分系统由十个维度组成，每个维度最低0分，最高10分，因此总分是100分，然后除以 10 之后，得出在页面展示的「10分制」总分。</p>
      <p>在选取哪十个维度时，并无法做到完全的深思熟虑，因此可能会存在一些不合理的地方，还请大家见谅！</p>
      <p><strong>笑点</strong>：这部作品是否让你开怀大笑了呢？虽然这个维度对「悲剧作品」不怎么友好，但有一部分喜剧它的核心其实源于悲剧。</p>
      <p><strong>泪点</strong>：这部作品让你泪腺崩坏了吗？同样的，虽然这个维度对「喜剧作品」不怎么友好，但也存在一些笑着笑着忽然催人泪下的作品？</p>
      <p><strong>燃点</strong>：这个不需要多余的解释，成为神话吧，少年！</p>
      <p><strong>萌点</strong>：em.....大家现在对萌系的东西都很喜爱，所以就单独拿出来做了一个分类，如果这部作品中有可爱的角色，就给它加分吧！</p>
      <p><strong>音乐</strong>：音乐包括：OP、ED、BGM、声优，是一个综合性的分类。</p>
      <p><strong>画面</strong>：画面包括：静态的人物、建筑、风景的设计与精度，还包括动态的画面连贯性、帧率、特效等。</p>
      <p><strong>情节</strong>：好的作品情节总是跌宕起伏、扑朔里面，基本猜不到下一步会发展成什么样子，并且叙事手法、伏笔运用都非常的精妙。</p>
      <p><strong>人设</strong>：一些动漫角色的存在甚至成为了我们的人生信条、憧憬的方向、美的标准，如是纯粹的恶、超强的头脑、强大的意志力等，是作品的灵魂。</p>
      <p><strong>内涵</strong>：作品所表达的世界观、价值观、人生观等，对人生的思考具有一定的引导价值。</p>
      <p><strong>美感</strong>：有时候画质不是越好就越美，有些美具有一种艺术感，这种美可能是画面上的，可能是叙事的手法，可能是背景音乐。</p>
      <p>最后，一般情况下不存在0分的作品，如果你认为一部作品是0分，那就请放过它吧；也不存在满分的作品，如果你认为一部作品达到了满分，可能是你的阅片量还太少，需要再接再厉，(๑•̀ㅂ•́)و✧！</p>
    </div>
    <div class="field" v-if="collapsed">
      <span>总分：</span>
      <div @click="collapsed = false">{{ total ? `${total} 分` : `${total}（点击修改各维度分数）` }}</div>
    </div>
    <el-collapse-transition>
      <div
        v-show="!collapsed"
        class="star-row"
      >
        <div
          v-for="(item, index) in columns"
          :key="index"
          class="star-item"
        >
          <div
            class="label"
            v-text="`${labelMap[item]}：`"
          />
          <van-rate
            v-model="form[item]"
            :size="20"
            :count="10"
          />
        </div>
      </div>
    </el-collapse-transition>
    <h3 class="sub-title">写下心得</h3>
    <json-editor @submit="beforeSubmit"/>
  </div>
</template>

<script>
  import Api from '~/api/scoreApi'
  import Rate from 'vant/lib/rate'
  import 'vant/lib/vant-css/rate.css'
  import JsonEditor from '~/components/jsonEditor/index'
  import BangumiPicker from '~/components/bangumi/BangumiPicker'

  export default {
    name: 'ScoreCreate',
    async asyncData ({ store, route, ctx }) {
      const id = route.params.id
      if (id) {
        await store.dispatch('editor/getData', {
          api: new Api(ctx),
          id
        })
      }
    },
    components: {
      vanRate: Rate,
      JsonEditor,
      BangumiPicker
    },
    data () {
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
      const bid = this.$route.query.bid
      return {
        openTips: false,
        collapsed: true,
        labelMap,
        columns: Object.keys(labelMap),
        bangumiId: bid ? +bid : '',
        form: {
          lol: 0,
          cry: 0,
          fight: 0,
          moe: 0,
          sound: 0,
          vision: 0,
          story: 0,
          role: 0,
          express: 0,
          style: 0
        }
      }
    },
    computed: {
      id () {
        return +(this.$route.params.id || 0)
      },
      resource () {
        return this.$store.state.editor.resource
      },
      disabled () {
        return !!this.id
      },
      bid () {
        return this.$route.query.bid
      },
      total () {
        let result = 0
        this.columns.forEach(key => {
          result += this.form[key]
        })
        return result
      }
    },
    mounted () {
      if (this.id) {
        this.loadEditContent()
      }
      if (this.bid) {
        this.handleBangumiSearch(this.bangumiId)
      }
    },
    methods: {
      beforeSubmit (richContent) {
        if (!this.bangumiId) {
          this.$toast.error('请先选择要评价的番剧')
          return
        }
        const scores = {}
        let total = 0
        Object.keys(this.form).forEach(key => {
          const value = this.form[key]
          scores[key] = value
          total += value
        })
        if (!total) {
          this.$toast.error('请先选择各维度分值')
          return
        }
        if (total === 100) {
          this.$toast.error('请认真考虑后再发表')
          return
        }
        if (richContent.id) {
          this.submit(richContent, scores)
        } else {
          this.$captcha({
            success: ({ data }) => {
              this.submit(richContent, scores, data)
            },
            error: (e) => {
              this.$toast.error(e)
            }
          })
        }
      },
      async submit (richContent, scores, geetest = {}) {
        this.$channel.$emit('write-submit', true)
        const api = new Api(this)
        try {
          const form = Object.assign({}, scores, {
            bangumi_id: this.bangumiId,
            content: richContent.content,
            intro: richContent.desc.substring(0, 120),
            do_publish: richContent.publish,
            geetest
          })
          let newId = richContent.id
          if (newId) {
            form.id = newId
            await api.update(form)
          } else {
            newId = await api.create(form)
          }
          if (richContent.publish) {
            this.$confirm('发布成功', '提示', {
              confirmButtonText: '点击查看',
              cancelButtonText: '继续编辑',
              type: 'warning'
            }).then(() => {
              window.location.href = this.$alias.score(newId)
            }).catch(() => {})
          } else {
            this.$toast.success('操作成功')
            if (!richContent.id) {
              setTimeout(() => {
                window.location = this.$alias.editScore(newId)
              }, 1000)
            }
          }
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.$channel.$emit('write-save-done')
          this.$channel.$emit('write-submit', false)
        }
      },
      handleBangumiSearch (bangumiId) {
        if (this.id) {
          return
        }
        const api = new Api(this)
        api.check({
          id: bangumiId
        }).then((id) => {
          if (id) {
            this.$confirm('你已经给该番剧评过分了，不能重复评分', '提示', {
              confirmButtonText: '查看我的评分',
              cancelButtonText: '换一个番剧',
              type: 'warning'
            }).then(() => {
              window.location.href = this.$alias.score(id)
            }).catch(() => {
              this.bangumiId = ''
            })
          }
        })
      },
      loadEditContent () {
        if (!this.resource) {
          this.$toast.error('不能编辑他人的内容')
          setTimeout(() => {
            window.location.href = '/review/create'
          }, 1000)
          return
        }
        this.bangumiId = +this.resource.bangumi_id
        this.columns.forEach(key => {
          this.form[key] = this.resource[key] * 2
        })
      }
    }
  }
</script>
