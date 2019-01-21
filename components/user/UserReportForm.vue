<style lang="scss">
#user-report-form {
  margin-top: 10px;

  p {
    font-size: 12px;
    padding: 8px;
    color: #888;
  }

  textarea {
    min-height: 120px;
    background-color: #fafafa;
    padding: 10px;
  }

  .submit-btn {
    margin-top: 15px;
    margin-bottom: 30px;
    width: 100%;
  }
}
</style>

<template>
  <div
    id="user-report-form"
    class="container"
  >
    <v-radio
      v-model="selectedType"
      :options="options1"
      title="违反法律法规"/>
    <v-radio
      v-model="selectedType"
      :options="options2"
      title="侵犯个人权益"/>
    <v-radio
      v-model="selectedType"
      :options="options3"
      title="有害社区环境"/>
    <div v-if="needContent">
      <p>留言：</p>
      <textarea
        v-model.trim="content"
        placeholder="请说明情况"/>
    </div>
    <el-button
      :loading="loading"
      type="primary"
      class="submit-btn"
      @click="submit"
    >提交</el-button>
  </div>
</template>

<script>
import { report } from '~/api/userApi'
import VRadio from '~/components/common/Radio'

export default {
  name: 'UserReportForm',
  components: {
    VRadio
  },
  props: {
    id: {
      type: [Number, String],
      default: 0
    },
    model: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      selectedType: -1,
      loading: false,
      content: ''
    }
  },
  computed: {
    options1() {
      return [
        {
          label: '违法违规',
          value: 1
        },
        {
          label: '色情低俗',
          value: 2
        },
        {
          label: '赌博诈骗',
          value: 3
        }
      ]
    },
    options2() {
      return [
        {
          label: '人身攻击',
          value: 4
        },
        {
          label: '侵犯隐私',
          value: 5
        },
        {
          label: '内容抄袭',
          value: 6
        }
      ]
    },
    options3() {
      return [
        {
          label: '垃圾广告',
          value: 7
        },
        {
          label: '恶意引战',
          value: 8
        },
        {
          label: '重复内容/刷屏',
          value: 9
        },
        {
          label: '内容不相关',
          value: 10
        },
        {
          label: '互刷团子',
          value: 11
        },
        {
          label: '其它',
          value: 99
        }
      ]
    },
    needContent() {
      return this.selectedType === 99 || this.selectedType === 6
    }
  },
  methods: {
    async submit() {
      if (!this.id || !this.model) {
        this.$toast.error('参数错误')
        return
      }
      if (this.selectedType < 0) {
        this.$toast.error('请选择正确的分类')
        return
      }
      if (this.needContent && !this.content) {
        this.$toast.error('请填写具体情况')
        return
      }
      if (this.loading) {
        return
      }
      this.loading = true
      try {
        report(this, {
          id: this.id,
          message: this.content,
          type: this.selectedType === 99 ? 0 : this.selectedType,
          model: this.model
        })
      } finally {
        this.loading = false
        this.$toast.success('感谢您的反馈！')
        this.content = ''
        this.selectedType = -1
        this.$emit('success')
      }
    }
  }
}
</script>
