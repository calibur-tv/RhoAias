<style lang="scss">
.post-comment-form {
  .content {
    font-size: 16px;
    line-height: 24px;
    color: #000;
    font-weight: 400;
    height: 250px;
    margin-bottom: 5px;
  }
}
</style>

<template>
  <div class="post-comment-form">
    <textarea
      v-model.trim="forms.content"
      class="content"
      placeholder="来吧，尽情的（在1000字以内）发挥吧"
      maxlength="1000"
      @focus="handleAreaFocus"
    />
    <image-uploader
      :loading="submitting"
      :limit="exceed"
      :required="false"
      @submit="submit"
    />
  </div>
</template>

<script>
import scrollToY from '~/assets/js/scrollToY'
import ImageUploader from '~/components/common/ImageUploader'

export default {
  name: 'PostCommentForm',
  components: {
    ImageUploader
  },
  props: {
    type: {
      required: true,
      type: String
    },
    id: {
      required: true,
      type: Number
    },
    masterId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      forms: {
        content: ''
      },
      exceed: 5
    }
  },
  computed: {
    isGuest() {
      return !this.$store.state.login
    },
    submitting() {
      return this.$store.state.comment.submitting
    }
  },
  methods: {
    async submit(images) {
      if (this.isGuest) {
        this.$channel.$emit('sign-in')
        return
      }
      if (!this.forms.content) {
        if (!images.length) {
          this.$toast.error('内容不能为空')
        } else {
          this.$emit('close')
        }
        return
      }
      if (this.submitting) {
        return
      }
      this.$store.commit('comment/SET_SUBMITTING', { result: true })
      try {
        const result = await this.$store.dispatch('comment/createMainComment', {
          content: this.forms.content,
          images: images,
          type: this.type,
          id: this.id,
          ctx: this
        })
        this.$emit('close')
        this.forms = {
          content: ''
        }
        this.$toast.success(result.message)
        this.$store.commit('UPDATE_USER_EXP', result.exp)
        setTimeout(() => {
          const dom = document.getElementById(`comment-${result.data.id}`)
          dom && scrollToY(this.$utils.getOffsetTop(dom) - 100, 600)
        }, 400)
        this.$channel.$emit('image-upload-done')
      } finally {
        this.$store.commit('comment/SET_SUBMITTING', { result: false })
      }
    },
    handleRemove(file) {
      this.images.forEach((item, index) => {
        if (item.id === file.uid) {
          this.images.splice(index, 1)
        }
      })
    },
    handleSuccess(res, file) {
      this.images.push({
        id: file.uid,
        img: res.data
      })
    },
    handleExceed() {
      this.$toast.error(`最多可上传 ${this.exceed} 张图片!`)
    },
    beforeUpload(file) {
      if (this.isGuest) {
        this.$channel.$emit('sign-in')
        return
      }

      this.uploadConfig.max = 5
      this.uploadConfig.params = {
        userId: this.$store.state.user.id,
        id: this.id,
        type: 'post'
      }

      return this.handleImageUploadBefore(file)
    },
    handleAreaFocus() {
      document.body.scrollTop = 0
    }
  }
}
</script>
