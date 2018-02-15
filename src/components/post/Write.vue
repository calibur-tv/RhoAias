<style lang="scss">
  .post-write-drawer {
    text-align: left;

    textarea {
      font-size: 16px;
      line-height: 24px;
      color: #000;
      font-weight: 400;
      padding: 20px 17px 0;
      height: 120px;
    }

    .el-upload-list__item,
    .el-upload--picture-card {
      width: 15vw;
      height: 15vw;
      line-height: 15vw;
    }

    .btn-submit {
      margin-top: 15px;
    }
  }
</style>

<template>
  <span>
    <button class="create-btn">
      <i class="iconfont icon-pinglun" @click="open = true"></i>
    </button>
    <v-drawer
    class="post-write-drawer"
    v-model="open"
    from="right"
    size="100%"
    id="write-post"
    :header-text="postId ? '发表回复' : '发帖'"
  >
    <div class="container">
      <textarea
        placeholder="也来说两句（500字以内）"
        v-model.trim="content"
      ></textarea>
      <el-upload
        action="https://upload.qiniup.com"
        multiple
        list-type="picture-card"
        ref="uploader"
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
      <button
        class="btn-submit"
        @click="submit"
      >发布</button>
    </div>
  </v-drawer>
  </span>
</template>

<script>
  export default {
    name: 'write-post-reply',
    props: {
      postId: {
        type: Number
      },
      bangumiId: {
        type: Number
      }
    },
    data () {
      return {
        open: false,
        uploadHeaders: {
          token: ''
        },
        images: [],
        exceed: 4,
        content: '',
        title: ''
      }
    },
    computed: {
      formatContent () {
        let content = this.content
        while (content.match('\n\n') !== null) {
          content = content.replace('\n\n', '\n')
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
      }
    },
    methods: {
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
        if (!this.$store.state.login) {
          this.$channel.$emit('sign-in')
          return
        }
        const isFormat = ['image/jpeg', 'image/png', 'image/jpg'].indexOf(file.type) !== -1
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isFormat) {
          this.$toast.error('图片只能是 JPG 或 PNG 格式!')
          return false
        }
        if (!isLt2M) {
          this.$toast.error('图片大小不能超过 2MB!')
          return false
        }

        this.uploadHeaders.key = this.postId
          ? `user/${this.$store.state.user.id}/post/${this.postId}/${new Date().getTime()}-${file.name}`
          : `user/${this.$store.state.user.id}/post/0/${new Date().getTime()}-${file.name}`
        return true
      },
      async getUpToken () {
        await this.$store.dispatch('getUpToken')
        this.uploadHeaders.token = this.$store.state.user.uptoken.upToken
      },
      submit () {
        if (!this.content) {
          this.$toast.error('内容不能为空！')
          return
        }
        this.$captcha(async ({ data }) => {
          if (this.postId) {
            try {
              await this.$store.dispatch('post/reply', {
                postId: this.postId,
                content: this.formatContent,
                images: this.formatImages,
                geetest: data,
                ctx: this
              })
              this.images = []
              this.content = ''
              this.$refs.uploader.clearFiles()
              this.$toast.success('回复成功！')
              this.open = false
              const list = document.querySelectorAll('.post-reply-item')
              setTimeout(() => {
                this.$scrollToY(list[list.length - 1].offsetTop, 400)
              }, 1000)
            } catch (err) {
              this.$toast.error(err)
            }
          } else {
            try {
              const id = await this.$store.dispatch('post/create', {
                title: this.title,
                bangumiId: this.bangumiId,
                desc: this.content.substring(0, 120),
                content: this.formatContent,
                images: this.formatImages,
                geetest: data,
                ctx: this
              })
              this.images = []
              this.$toast.success('发布成功！')
              this.$router.push({
                name: 'post-show',
                params: { id: id.toString() }
              })
            } catch (err) {
              this.$toast.error(err)
            }
          }
        })
      }
    },
    mounted () {
      if (this.$store.state.login) {
        this.getUpToken()
      }
    }
  }
</script>
