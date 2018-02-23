<style lang="scss">
  #user-setting {
    $banner-height: 120px;

    .form-item {
      padding-top: $container-padding;
      padding-bottom: $container-padding;
      background-color: #fff;

      .title {
        color: #333;
        font-size: 14px;
        position: relative;
        padding-left: 12px;
        margin-bottom: 10px;
        margin-left: $container-padding;

        &:before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 3px;
          height: 100%;
          background-color: $color-blue-normal;
          border-radius: 3px;
        }
      }

      .input-item {
        position: relative;
        height: 48px;
        @include border-bottom();

        label {
          text-align: left;
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 80px;
          background-color: #fff;
          font-size: 16px;
          line-height: 48px;
        }

        .input {
          display: block;
          overflow: hidden;
          height: 100%;
          padding-left: 90px;
        }
      }
    }

    .banner {
      width: 100%;
      position: relative;
      overflow: hidden;
      z-index: 1;
      height: $banner-height;
      text-align: center;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      text-shadow: 0 1px 10px gray;

      button, .file-input {
        margin-top: 60px;
        margin-left: 10px;
        margin-right: 10px;
      }
    }

    .avatar {
      position: relative;
      vertical-align: middle;
      display: inline-block;
      margin-right: 20px;
      border-radius: 50%;
      width: 80px;
      height: 80px;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      @include border($color-gray-deep, 50%);
    }

    .change-image-btn {
      display: inline-block;
      @include btn-empty($color-blue-normal);
    }

    .cancel-image-btn {
      @include btn-empty($color-text-normal);
      margin-right: 10px;
    }

    .submit-image-btn {
      @include btn-empty($color-pink-deep)
    }

    .submit-banner-btn {
      display: inline-block;
      @include btn-empty(#fff)
    }
  }
</style>

<template>
  <div id="user-setting">
    <div class="form-item">
      <p class="title">背景：</p>
      <div class="banner" :style="{ backgroundImage: showBanner }">
        <template v-if="bannerSelector.data">
          <button class="submit-banner-btn" @click="cancelBannerSelect">取消</button>
          <button class="submit-banner-btn" @click="submitBannerChange">确认</button>
        </template>
        <div class="submit-banner-btn file-input" v-else>
          点击更新背景
          <input type="file" name="file" ref="bannerInput" @change="selectBanner">
        </div>
      </div>
    </div>
    <div class="hr"></div>
    <div class="form-item">
      <p class="title">头像：</p>
      <div class="container">
        <div class="avatar" :style="{ backgroundImage: showAvatar }"></div>
        <template v-if="avatarSelector.data">
          <button class="cancel-image-btn" @click="cancelAvatarSelect">取消</button>
          <button class="submit-image-btn" @click="submitAvatarChange">确认</button>
        </template>
        <div class="change-image-btn file-input" v-else>
          点击更新头像
          <input type="file" name="file" ref="avatarInput" @change="selectAvatar">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import UserApi from '~/api/userApi'
  import ImageApi from '~/api/imageApi'

  export default {
    name: 'page-user-setting',
    computed: {
      user () {
        return this.$store.state.user
      },
      showAvatar () {
        return this.avatarSelector.data
          ? `url(${this.avatarSelector.data})`
          : `url(${this.$resize(this.user.avatar, { width: 80 })})`
      },
      showBanner () {
        return this.bannerSelector.data
          ? `url(${this.bannerSelector.data})`
          : `url(${this.$resize(this.user.banner, { height: 120, mode: 2 })})`
      }
    },
    data () {
      return {
        settingForm: {
          nickname: '',
          signature: '',
          sex: 0,
          sexSecret: false,
          birthday: ''
        },
        avatarSelector: {
          loading: false,
          file: null,
          data: ''
        },
        bannerSelector: {
          loading: false,
          file: null,
          data: ''
        }
      }
    },
    methods: {
      selectAvatar (e) {
        const file = e.target.files[0]
        if (['image/jpeg', 'image/png', 'image/jpg'].indexOf(file.type) === -1) {
          this.$toast.info('仅支持 jpg / jpeg / png 格式的图片')
          return
        }
        const reader = new FileReader()
        this.avatarSelector.file = file
        reader.onload = (evt) => {
          this.avatarSelector.data = evt.target.result
        }
        reader.readAsDataURL(file)
      },
      cancelAvatarSelect () {
        this.avatarSelector.file = null
        this.avatarSelector.data = ''
        this.$nextTick(() => {
          this.$refs.avatarInput.value = ''
        })
      },
      async submitAvatarChange () {
        if (this.avatarSelector.loading) {
          return
        }

        this.$toast.loading('上传中...')
        this.avatarSelector.loading = true
        await this.$store.dispatch('getUpToken')
        const key = `user/${this.user.id}/avatar/${Date.now()}-${Math.random().toString(36).substring(3, 6)}`
        const formData = new FormData()
        formData.append('file', this.avatarSelector.file)
        formData.append('token', this.user.uptoken.upToken)
        formData.append('key', key)
        const imageApi = new ImageApi()
        try {
          await imageApi.uploadToQiniu(formData)
          const userApi = new UserApi(this)
          await userApi.settingImage({
            type: 'avatar',
            url: key
          })
          this.$store.commit('SET_USER_INFO', {
            avatar: `${this.$cdn.image}${key}`
          })
          this.$toast.success('头像更新成功')
        } catch (e) {
          this.$toast.error('头像更新失败，请联系管理员查看')
        }
        this.avatarSelector.loading = false
        this.cancelAvatarSelect()
      },
      selectBanner (e) {
        const file = e.target.files[0]
        if (['image/jpeg', 'image/png', 'image/jpg'].indexOf(file.type) === -1) {
          this.$toast.info('仅支持 jpg / jpeg / png 格式的图片')
          return
        }
        const reader = new FileReader()
        this.bannerSelector.file = file
        reader.onload = (evt) => {
          this.bannerSelector.data = evt.target.result
        }
        reader.readAsDataURL(file)
      },
      cancelBannerSelect () {
        this.bannerSelector.file = null
        this.bannerSelector.data = ''
        this.$nextTick(() => {
          this.$refs.avatarInput.value = ''
        })
      },
      async submitBannerChange () {
        if (this.bannerSelector.loading) {
          return
        }

        this.$toast.loading('上传中...')
        this.bannerSelector.loading = true
        await this.$store.dispatch('getUpToken')
        const key = `user/${this.user.id}/banner/${Date.now()}-${Math.random().toString(36).substring(3, 6)}`
        const formData = new FormData()
        formData.append('file', this.bannerSelector.file)
        formData.append('token', this.user.uptoken.upToken)
        formData.append('key', key)
        const imageApi = new ImageApi()
        try {
          await imageApi.uploadToQiniu(formData)
          const userApi = new UserApi(this)
          await userApi.settingImage({
            type: 'banner',
            url: key
          })
          this.$store.commit('SET_USER_INFO', {
            banner: `${this.$cdn.image}${key}`
          })
          this.$toast.success('背景更新成功')
        } catch (e) {
          this.$toast.error('背景更新失败，请联系管理员查看')
        }
        this.bannerSelector.loading = false
        this.cancelAvatarSelect()
      }
    },
    mounted () {
      if (!this.$store.state.login) {
        window.location.href = '/'
      }
      this.settingForm = {
        nickname: this.user.nickname,
        signature: this.user.signature,
        sex: this.user.sex > 2 ? this.user.sex - 2 : this.user.sex,
        sexSecret: this.user.sex > 2,
        birthday: this.user.birthday ? this.user.birthday * 1000 : ''
      }
    }
  }
</script>
