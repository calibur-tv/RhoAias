export default {
  data() {
    return {
      uploadHeaders: {
        key: '',
        token: ''
      },
      uploadConfig: {
        max: 5
      },
      imageUploadAccept: [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'image/gif'
      ].toString(),
      imageUploadAction: 'https://upload.qiniup.com',
      imagePrefix: 'https://image.calibur.tv/',
      getUpTokenTimer: 0,
      uploadPending: 0,
      uploadImageTotal: 0,
      uploadImageList: []
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.user
    }
  },
  watch: {
    currentUser: {
      handler: function(val) {
        if (val && val.uptoken) {
          this.uploadHeaders.token = val.uptoken.upToken
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.getUpTokenTimer = setInterval(() => {
      this.getUpToken()
    }, 1000 * 60 * 30)
  },
  beforeDestroy() {
    this.getUpTokenTimer && clearInterval(this.getUpTokenTimer)
  },
  methods: {
    async getUpToken() {
      try {
        await this.$store.dispatch('getUpToken')
      } catch (e) {
        // do nothing
      }
    },
    handleImageUploadError(err, file) {
      console.log(err)
      this.uploadPending--
      this.uploadImageList.forEach((item, index) => {
        if (item.uid === file.uid) {
          this.uploadImageList.splice(index, 1)
        }
      })
      this.$toast.error(`图片：${file.name} 上传失败`)
    },
    beforeImageUpload(file) {
      const isFormat = ~this.imageUploadAccept.split(',').indexOf(file.type)
      const isLt5M = file.size / 1024 / 1024 < this.uploadConfig.max

      if (!isFormat) {
        this.$toast.error(
          `仅支持上传${this.imageUploadAccept
            .replace(/image\//g, '')
            .replace(/,/g, '、')}格式的图片`
        )
        return false
      }
      if (!isLt5M) {
        this.$toast.error(`图片大小不能超过 ${this.uploadConfig.max}MB!`)
        return false
      }

      const createFileName = ({ userId, page, file }) => {
        return `admin/${userId}${page}/${new Date().getTime()}-${Math.random()
          .toString(36)
          .substring(3, 6)}.${file.type.split('/').pop()}`
      }

      this.uploadHeaders.key = createFileName({
        userId: this.currentUser.id,
        page: this.$route.path,
        file
      })

      return true
    },
    handleImageUploadRemove(file) {
      this.uploadImageList.forEach((item, index) => {
        if (item.uid === file.uid) {
          this.uploadImageList.splice(index, 1)
        }
      })
    },
    handleImageUploadSuccess(res, file) {
      this.uploadImageList.forEach((item, index) => {
        if (item.uid === file.uid) {
          this.uploadImageList[index] = Object.assign(item, {
            data: res.data,
            status: 'success',
            url: this.$resize(`${this.imagePrefix}${res.data.url}`, {
              width: 100
            })
          })
        }
      })
      this.uploadImageTotal++
      this.uploadPending--
    },
    handleImageUploadBefore(file) {
      if (!this.currentUser) {
        this.$channel.$emit('sign-in')
        return false
      }

      const isFormat =
        this.imageUploadAccept.split(',').indexOf(file.type) !== -1
      const isLtSize = file.size / 1024 / 1024 < this.uploadConfig.max

      if (!isFormat) {
        this.$toast.error('仅支持jpg, jpeg, png, gif格式的图片')
        return false
      }
      if (!isLtSize) {
        this.$toast.error(`图片大小不能超过 ${this.uploadConfig.max}MB!`)
        return false
      }

      this.uploadHeaders.key = this.$utils.createFileName({
        userId: this.$store.state.user.id,
        type: this.$route.path,
        file
      })

      this.uploadImageList.push({
        name: file.name,
        percentage: 0,
        raw: file,
        size: file.size,
        status: 'uploading',
        uid: file.uid
      })
      this.uploadPending++

      return true
    }
  }
}
