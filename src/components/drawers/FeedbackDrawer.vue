<style lang="scss">
  .feedback-drawer {
    text-align: left;

    .desc {
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
</style>

<template>
  <v-drawer
    class="feedback-drawer"
    v-model="show"
    from="bottom"
    size="100%"
    header-text="反馈"
  >
    <div class="container">
      <div class="desc">
        <p>详细信息</p>
        <textarea v-model.trim="content" placeholder="请填写详细信息"></textarea>
      </div>
      <v-radio
        title="反馈类型"
        v-model="selectedType"
        :options="options">
      </v-radio>
      <button @click="submitFeedback" class="btn-submit">提交</button>
    </div>
  </v-drawer>
</template>

<script>
  import UserApi from '~/api/userApi'

  export default {
    name: 'FeedbackDrawer',
    data () {
      return {
        show: false,
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
    mounted () {
      this.$channel.$on('open-feedback', ({ type, desc } = {}) => {
        this.selectedType = type || 1
        this.content = desc || ''
        this.show = true
      })
    },
    methods: {
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
        this.show = false
      }
    }
  }
</script>
