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
    v-model="show"
    :backdrop="false"
    class="feedback-drawer"
    from="bottom"
    size="100%"
    header-text="反馈"
  >
    <div class="container">
      <div class="desc">
        <p>详细信息</p>
        <textarea 
          v-model.trim="content" 
          :placeholder="placeholder"/>
      </div>
      <v-radio
        v-model="selectedType"
        :options="options"
        title="反馈类型"/>
      <button 
        class="btn-submit" 
        @click="submitFeedback">提交</button>
    </div>
  </v-drawer>
</template>

<script>
import { feedback } from '~/api/userApi'
import VRadio from '~/components/common/Radio'

export default {
  name: 'FeedbackDrawer',
  components: {
    VRadio
  },
  data() {
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
      placeholder: '',
      content: '',
      preContent: ''
    }
  },
  mounted() {
    this.$channel.$on('open-feedback', ({ type, desc, placeholder } = {}) => {
      this.selectedType = type || 1
      this.preContent = desc || '{?}'
      this.placeholder =
        placeholder || '非常感谢您的反馈，请填写详细信息方便我们解决'
      this.show = true
    })
  },
  methods: {
    async submitFeedback() {
      if (!this.content.length) {
        this.$toast.error('请先填写反馈信息！')
        return
      }
      await feedback(this, {
        type: this.selectedType,
        desc: this.preContent.replace('{?}', this.content),
        ua: navigator.userAgent
      })
      this.$toast.success('反馈成功，感谢您的反馈！')
      this.content = ''
      this.show = false
    }
  }
}
</script>
