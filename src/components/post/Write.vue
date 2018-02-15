<style lang="scss">
  .post-write-drawer {
    text-align: left;

    .title {
      font-size: 16px;
      color: #000;
      line-height: 20px;
      padding-top: 20px;
    }

    .bangumi {
      font-size: 16px;

      span {
        color: #666;
        float: left;
      }

      div {
        color: #000;
        overflow: hidden;
      }
    }

    .content {
      font-size: 16px;
      line-height: 24px;
      color: #000;
      font-weight: 400;
      height: 120px;
      padding-top: 10px;
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
  <v-drawer
    class="post-write-drawer"
    v-model="open"
    from="right"
    size="100%"
    id="write-post"
    :header-text="postId ? '发表回复' : '发帖'"
  >
    <div class="container">
      <template v-if="!postId">
        <input
          class="title"
          type="text"
          v-model.trim="title"
          maxlength="40"
          placeholder="加个标题哟~"
        >
        <div class="bangumi">
          <span>发布到：</span>
          <div
            @click="handleBangumiPickerBtnClick"
            v-text="selectedBangumi"
          ></div>
        </div>
        <v-drawer
          v-model="openBangumisDrawer"
          class="bangumis-drawer"
          from="bottom"
          size="40%"
          header-text="选择番剧"
        >
          <mt-picker
            :slots="slots"
            @change="onValuesChange"
            valueKey="name"
          ></mt-picker>
        </v-drawer>
      </template>
      <textarea
        class="content"
        :placeholder="postId ? '也来说两句（500字以内）' : '来吧，尽情的（在500字以内）发挥吧'"
        maxlength="500"
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
        title: '',
        slots: [
          {
            flex: 1,
            defaultIndex: 0,
            values: [],
            textAlign: 'center'
          }
        ],
        followedBangumi: false,
        openBangumisDrawer: false,
        loading: false
      }
    },
    watch: {
      open (val) {
        if (val && !this.postId) {
          this.getUserFollowedBangumis()
        }
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
      },
      selectedBangumi () {
        if (this.loading) {
          return '加载中...'
        }
        if (!this.followedBangumi) {
          return '点击选择番剧'
        }
        return this.slots[0].values[this.slots[0].defaultIndex].name
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
        if (this.loading) {
          this.$toast.error('番剧加载中')
          return
        }
        if (!this.postId) {
          if (!this.followedBangumi) {
            this.$toast.error('必须先关注才能发帖')
            return
          }
          if (!this.title) {
            this.$toast.error('标题不能为空！')
            return
          }
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
                bangumiId: this.slots[0].values[this.slots[0].defaultIndex].id,
                desc: this.content.substring(0, 120),
                content: this.formatContent,
                images: this.formatImages,
                geetest: data,
                ctx: this
              })
              this.images = []
              this.$toast.success('发布成功！')
              this.open = false
              this.$router.push({
                name: 'post-show',
                params: { id: id.toString() }
              })
            } catch (err) {
              this.$toast.error(err)
            }
          }
        })
      },
      onValuesChange (picker, values) {
        if (!values[0]) {
          return
        }
        const id = values[0].id
        this.slots[0].values.forEach((item, index) => {
          if (item.id === id) {
            this.slots[0].defaultIndex = index
            this.followedBangumi = true
          }
        })
      },
      async getUserFollowedBangumis () {
        if (this.loading) {
          return
        }
        this.loading = true
        try {
          this.slots[0].values = await this.$store.dispatch('users/getFollowBangumis', {
            zone: this.$store.state.user.zone,
            self: true
          })
          this.followedBangumi = false
        } catch (e) {
          this.$toast.error(e)
        } finally {
          this.loading = false
        }
      },
      handleBangumiPickerBtnClick () {
        if (!this.slots[0].values.length) {
          this.$toast.error('还没有关注任何番剧')
          return
        }
        this.openBangumisDrawer = true
      }
    },
    mounted () {
      if (this.$store.state.login) {
        this.getUpToken()
      }
    }
  }
</script>
