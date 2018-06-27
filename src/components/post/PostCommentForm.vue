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
  <div class="post-comment-form">
    <textarea
      class="content"
      placeholder="来吧，尽情的（在1000字以内）发挥吧"
      maxlength="1000"
      v-model.trim="forms.content"
      @focus="handleAreaFocus"
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
    >
      +
    </el-upload>
    <el-button class="submit-btn" type="primary" @click="submit" :loading="submitting">发布</el-button>
  </div>
</template>

<script>
  export default {
    name: 'post-comment-form',
    props: {
      type: {
        required: true,
        type: String
      },
      id: {
        required: true,
        type: Number
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
          const newComment = await this.$store.dispatch('comment/createMainComment', {
            content: this.formatContent,
            images: this.formatImages,
            type: this.type,
            id: this.id,
            ctx: this
          })
          this.$emit('close')
          this.forms = {
            content: ''
          }
          this.images = []
          this.$refs.uploader.clearFiles()
          this.$toast.success('评论成功')
          setTimeout(() => {
            const dom = document.getElementById(`comment-${newComment.id}`)
            dom && this.$scrollToY(this.$utils.getOffsetTop(dom) - 100, 600)
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

        const isFormat = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].indexOf(file.type) !== -1
        const isLt2M = file.size / 1024 / 1024 < 5

        if (!isFormat) {
          this.$toast.error('仅支持 jpg / jpeg / png / gif 格式的图片')
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
      },
      handleAreaFocus () {
        document.body.scrollTop = 0
      }
    },
    mounted () {
      if (!this.isGuest) {
        this.getUpToken()
      }
    }
  }
</script>
