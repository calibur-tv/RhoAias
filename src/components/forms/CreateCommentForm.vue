<style lang="scss">
  .create-comment-form {
    .content {
      font-size: 16px;
      line-height: 24px;
      color: #000;
      font-weight: 400;
      height: 250px;
      margin-bottom: 5px;
    }

    .el-upload-list__item,
    .el-upload--picture-card {
      width: 15vw;
      height: 15vw;
      line-height: 15vw;
    }

    .el-upload-list__item-delete {
      float: none !important;
    }

    .submit-btn {
      margin-top: 15px;
      width: 100%;
    }
  }
</style>

<template>
  <div class="create-comment-form">
    <textarea
      class="content"
      placeholder="来吧，尽情的（在1000字以内）发挥吧"
      maxlength="1000"
      v-model.trim="forms.content"
    ></textarea>
    <el-upload
      action="https://upload.qiniup.com"
      multiple
      list-type="picture-card"
      ref="uploader"
      :disabled="true"
      :data="uploadHeaders"
      :on-error="handleError"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-exceed="handleExceed"
      :limit="exceed"
      :before-upload="beforeUpload"
      v-if="withImage"
    >
      +
    </el-upload>
    <el-button class="submit-btn" type="primary" @click="submit" :loading="submitting">发布</el-button>
  </div>
</template>

<script>
  export default {
    name: 'create-comment-form',
    props: {
      type: {
        required: true,
        type: String
      },
      id: {
        required: true,
        type: Number
      },
      withImage: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      isGuest () {
        return !this.$store.state.login
      },
      formatContent () {
        let content = this.forms.content
        while (content.match('\n\n\n') !== null) {
          content = content.replace(/\n\n\n/g, '\n\n')
        }
        content = content.split('\n')

        const res = []
        content.forEach(item => {
          res.push(item ? `<p>${item}</p>` : '<p><br/></p>')
        })

        return res.join('')
      },
      formatImages () {
        return this.images.map(item => item.img)
      },
      submitting () {
        return this.$store.state.comment.submitting
      }
    },
    data () {
      return {
        forms: {
          content: ''
        },
        uploadHeaders: {
          token: ''
        },
        images: [],
        exceed: 5
      }
    },
    methods: {
      async submit () {
        if (this.isGuest) {
          this.$channel.$emit('sign-in')
          return
        }
        if (!this.formatContent) {
          this.$emit('close')
          return
        }
        if (this.submitting) {
          return
        }
        this.$store.commit('comment/SET_SUBMITTING', { result: true })
        try {
          await this.$store.dispatch('comment/createMainComment', {
            content: this.formatContent,
            images: this.formatImages,
            type: this.type,
            id: this.id,
            ctx: this
          })
          this.$toast.success('评论成功')
          this.$emit('close')
          this.forms = {
            content: ''
          }
          this.$refs.uploader.clearFiles()
          const list = document.querySelectorAll('.comment-item-wrap')
          setTimeout(() => {
            const dom = list[list.length - 1]
            dom && this.$scrollToY(dom.offsetTop, 600)
          }, 400)
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.$store.commit('comment/SET_SUBMITTING', { result: false })
        }
      },
      handleError (err, file) {
        console.log(err)
        this.$toast.error(`图片：${file.name} 上传失败`)
      },
      handleRemove (file) {
        this.images.forEach((item, index) => {
          if (item.id === file.uid) {
            this.images.splice(index, 1)
          }
        })
      },
      handleSuccess (res, file) {
        this.images.push({
          id: file.uid,
          img: res.data
        })
      },
      handleExceed () {
        this.$toast.error(`最多可上传 ${this.exceed} 张图片!`)
      },
      beforeUpload (file) {
        if (this.isGuest) {
          this.$channel.$emit('sign-in')
          return
        }

        const isFormat = ['image/jpeg', 'image/png', 'image/jpg'].indexOf(file.type) !== -1
        const isLt2M = file.size / 1024 / 1024 < 5

        if (!isFormat) {
          this.$toast.error('图片只能是 JPG 或 PNG 格式!')
          return false
        }
        if (!isLt2M) {
          this.$toast.error('图片大小不能超过 5MB!')
          return false
        }

        this.uploadHeaders.key = this.$utils.createFileName({
          userId: this.$store.state.user.id,
          type: this.type,
          id: this.postId,
          file
        })

        return true
      },
      async getUpToken () {
        try {
          await this.$store.dispatch('getUpToken', this)
          this.uploadHeaders.token = this.$store.state.user.uptoken.upToken
        } catch (e) {
          this.$toast.error(e)
        }
      }
    },
    mounted () {
      if (!this.isGuest && this.withImage) {
        this.getUpToken()
      }
    }
  }
</script>
