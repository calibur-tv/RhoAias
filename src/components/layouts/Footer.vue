<style lang="scss">
  #footer {
    text-align: center;
    color: #999;
    padding: $container-padding;
    font-size: 13px;
    background-color: #ffffff;

    .panel {
      margin-top: 14px;

      a, button {
        padding: 0 16px;
        color: #666;
        font-size: 12px;

        &:not(:last-child) {
          position: relative;

          &:after {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            width: 1px;
            background-color: #ccc;
            right: 0;
          }
        }
      }
    }

    .slogan {
      margin-top: 20px;
      margin-bottom: 20px;
    }

    .feedback-drawer {
      text-align: left;

      .desc {
        margin-top: 20px;

        p {
          margin: 8px 0;
        }

        textarea {
          min-height: 120px;
          background-color: #fafafa;
          padding: 10px;
        }
      }

      .btn-submit {
        margin-top: 15px;
        margin-bottom: 30px;
      }
    }

    .share-tips-drawer {
      border-radius: 10px 10px 0 0;

      .container {
        text-align: left;

        p {
          margin-top: 20px;
          margin-bottom: 20px;
          line-height: 20px;
          color: #333;
        }

        .btn-submit {
          margin-top: 10px;
        }
      }
    }
  }
</style>

<template>
  <footer id="footer">
    <div class="panel">
      <button @click="logout" v-if="$store.state.login">退出</button>
      <template v-else>
        <button @click="login">登录</button>
        <button @click="register">注册</button>
      </template>
      <button @click="openFeedbackDrawer = true">反馈</button>
      <a href="/about/hello">欢迎</a>
      <button @click="openShareModal">分享</button>
    </div>
    <v-drawer
      class="feedback-drawer"
      v-model="openFeedbackDrawer"
      from="bottom"
      size="100%"
      header-text="反馈"
    >
      <div class="container">
        <v-radio
          title="反馈类型"
          v-model="selectedType"
          :options="options">
        </v-radio>
        <div class="desc">
          <p>详细信息</p>
          <textarea v-model.trim="content" placeholder="请填写详细信息"></textarea>
        </div>
        <button @click="submitFeedback" class="btn-submit">提交</button>
      </div>
    </v-drawer>
    <v-drawer
      class="share-tips-drawer"
      v-model="toggleShareModal"
      from="bottom"
      size="80%"
      header-text="分享语"
    >
      <div class="container">
        <p>
          【calibur.tv】一个纯粹的二次元社区网站，致力于实现"天下漫友是一家"！
        </p>
        <p>
          站内海量动漫资源在线播放，更有看漫画、cosplay、发帖、为偶像应援等功能，每天签到送金币（1金币 = 1人民币）！
        </p>
        <p>
          快来加入我们吧~\(^o^)/~ 网址：http://calibur.tv
        </p>
        <button
          class="btn-submit"
          ref="shareBtn"
          data-clipboard-text="【calibur.tv】一个纯粹的二次元社区网站，致力于实现'天下漫友是一家'！站内海量动漫资源在线播放，更有看漫画、cosplay、发帖、为偶像应援等功能，每天签到送金币（1金币 = 1人民币）！快来加入我们吧~\(^o^)/~ 网址：http://calibur.tv"
        >点击复制</button>
      </div>
    </v-drawer>
    <p class="slogan">天下漫友是一家 - calibur</p>
  </footer>
</template>

<script>
  import UserApi from '~/api/userApi'
  import Clipboard from 'clipboard'

  export default {
    name: 'v-footer',
    data () {
      return {
        openFeedbackDrawer: false,
        toggleShareModal: false,
        options: [
          {
            label: '功能建议',
            value: 1
          },
          {
            label: '遇到错误',
            value: 2
          },
          {
            label: '资源报错',
            value: 4
          },
          {
            label: '求资源',
            value: 5
          },
          {
            label: '求偶像',
            value: 6
          },
          {
            label: '其它问题',
            value: 3
          }
        ],
        selectedType: 1,
        content: ''
      }
    },
    methods: {
      logout () {
        this.$cookie.remove('JWT-TOKEN')
        const api = new UserApi(this)
        api.logout()
        window.location.reload()
      },
      login () {
        this.$channel.$emit('sign-in', (false))
      },
      register () {
        this.$channel.$emit('sign-up')
      },
      async submitFeedback () {
        if (!this.content.length) {
          this.$toast.error('请先填写反馈信息！')
          return
        }
        const api = new UserApi(this)
        await api.feedback({
          type: this.selectedType,
          desc: this.content,
          ua: navigator.userAgent + navigator.appVersion + navigator.vendor
        })
        this.$toast.success('反馈成功，感谢您的反馈！')
        this.openFeedbackDrawer = false
      },
      openShareModal () {
        this.toggleShareModal = true
        this.$nextTick(() => {
          const clipboard = new Clipboard(this.$refs.shareBtn)

          clipboard.on('success', e => {
            this.$toast.success('复制成功')
            this.toggleShareModal = false
            clipboard.destroy()
            e.clearSelection()
          })
        })
      }
    },
    mounted () {
      this.$channel.$on('open-feedback', ({ type, desc } = {}) => {
        this.selectedType = type || 1
        this.content = desc || ''
        this.openFeedbackDrawer = true
      })
    }
  }
</script>
