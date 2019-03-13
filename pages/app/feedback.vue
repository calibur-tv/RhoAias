<style lang="scss">
#app-feedback {
  .desc {
    p {
      font-size: 12px;
      padding: 8px;
      display: block;
      color: #6d757a;
    }

    textarea {
      min-height: 120px;
      background-color: #f5f8fa;
      padding: 10px;
      border-radius: 4px;
    }
  }

  .mint-radiolist-title {
    color: #6d757a;
  }

  .mint-radiolist-title:before,
  .mint-radiolist-label:before {
    background-color: #ccd6dd;
    transform: scaleY(0.5);
  }

  .btn-submit,
  .mint-radio .mint-radio-input:checked + .mint-radio-core {
    background-color: #ff6881;
    border-color: #ff6881;
  }

  .btn-submit {
    margin-top: 15px;
    margin-bottom: 30px;
  }
}
</style>

<template>
  <div id="app-feedback" class="container">
    <div class="desc">
      <p>详细信息</p>
      <textarea v-model.trim="content" placeholder="请先填写反馈信息" />
    </div>
    <VRadio v-model="selectedType" :options="options" title="反馈类型" />
    <button class="btn-submit" @click="submitFeedback">
      提交
    </button>
  </div>
</template>

<script>
import { feedback } from '~/api/userApi'
import VRadio from '~/components/common/Radio'

export default {
  name: 'AppFeedback',
  layout: 'empty',
  components: {
    VRadio
  },
  head: {
    title: '反馈'
  },
  data() {
    return {
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
    async submitFeedback() {
      if (!this.content.length) {
        this.$toast.error('请先填写反馈信息！')
        return
      }
      await feedback(this, {
        type: this.selectedType,
        desc: this.content,
        ua: navigator.userAgent
      })
      this.$toast.success('反馈成功，感谢您的反馈！')
      this.content = ''
    }
  }
}
</script>
