<style lang="scss">
  #footer {
    text-align: center;
    color: #999;
    padding: $container-padding;
    font-size: 13px;
    background-color: #ffffff;

    .panel {
      margin-top: 14px;

      button {
        padding: 0 24px;
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
      <router-link to="/about/hello">
        <button>欢迎</button>
      </router-link>
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
    <p class="slogan">天下漫友是一家 - calibur</p>
  </footer>
</template>

<script>
  import UserApi from '~/api/userApi'

  export default {
    name: 'v-footer',
    data () {
      return {
        openFeedbackDrawer: false,
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
        this.$channel.$emit('switch-to-register', false)
        this.$channel.$emit('drawer-open-sign')
      },
      register () {
        this.$channel.$emit('switch-to-register', true)
        this.$channel.$emit('drawer-open-sign')
      },
      async submitFeedback () {
        if (!this.content.length) {
          this.$toast.warn('请先填写反馈信息！')
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
      }
    },
    mounted () {
      this.$channel.$on('open-feedback', ({ type, desc }) => {
        this.selectedType = type || 1
        this.content = desc || ''
        this.openFeedbackDrawer = true
      })
    }
  }
</script>
