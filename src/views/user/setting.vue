<style lang="scss">
  #user-setting {
    $banner-height: 120px;

    .form-item {
      padding-top: $container-padding;
      padding-bottom: $container-padding;
      background-color: #fff;

      .sub-title {
        margin-left: $container-padding;
      }

      .input-item {
        position: relative;
        height: 48px;
        @include border-bottom();

        input {
          display: block;
          overflow: hidden;
          height: 100%;
          padding-left: 90px;
        }

        .vdatetime {
          height: 100%;

          .vdatetime-popup__header,
          .vdatetime-calendar__month__day--selected > span > span,
          .vdatetime-calendar__month__day--selected:hover > span > span {
            background: $color-blue-normal;
          }

          .vdatetime-year-picker__item--selected,
          .vdatetime-time-picker__item--selected,
          .vdatetime-popup__actions__button {
            color: $color-blue-normal;
          }
        }
      }

      .label {
        text-align: left;
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 80px;
        font-size: 16px;
        line-height: 48px;
      }

      .other-form-wrap {
        position: relative;

        .mint-radiolist {
          padding-left: 70px;
        }

        .mint-radiolist-title {
          display: none;
        }
      }

      #signature {
        min-height: 120px;
        padding-left: 80px;
        line-height: 48px;
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
      <p class="sub-title">背景：</p>
      <div class="banner" :style="{ backgroundImage: showBanner }">
        <template v-if="bannerSelector.data">
          <button class="submit-banner-btn" @click="cancelBannerSelect">取消</button>
          <button class="submit-banner-btn" @click="submitBannerChange">确认</button>
        </template>
        <div class="submit-banner-btn file-input" v-else>
          点击更新背景
          <input type="file" accept="image/png, image/jpeg, image/jpg, image/x-png" name="file" ref="bannerInput" @change="selectBanner">
        </div>
      </div>
    </div>
    <div class="hr"></div>
    <div class="form-item">
      <p class="sub-title">头像：</p>
      <div class="container">
        <div class="avatar" :style="{ backgroundImage: showAvatar }"></div>
        <template v-if="avatarSelector.data">
          <button class="cancel-image-btn" @click="cancelAvatarSelect">取消</button>
          <button class="submit-image-btn" @click="submitAvatarChange">确认</button>
        </template>
        <div class="change-image-btn file-input" v-else>
          点击更新头像
          <input type="file" accept="image/png, image/jpeg, image/jpg, image/x-png" name="file" ref="avatarInput" @change="selectAvatar">
        </div>
      </div>
    </div>
    <div class="hr"></div>
    <div class="form-item">
      <p class="sub-title">其它：</p>
      <div class="container">
        <div class="input-item">
          <label class="label" for="nickname">昵称：</label>
          <input
            name="nickname"
            id="nickname"
            type="text"
            class="input"
            v-validate="'required|nickname:2-14'"
            v-model.trim="settingForm.nickname"
            autocomplete="off"
            placeholder="2-14个字符组成"
          >
        </div>
        <div class="other-form-wrap">
          <label class="label">性别：</label>
          <v-radio
            v-model="settingForm.sex"
            :options="sexOptions">
          </v-radio>
        </div>
        <div class="other-form-wrap">
          <label for="signature" class="label">签名：</label>
          <textarea
            id="signature"
            v-model.trim="settingForm.signature"
            placeholder="用简单的言语，表达深刻的心"
            maxlength="20"
          ></textarea>
        </div>
        <button @click="saveSetting" class="btn-submit">保存</button>
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
        },
        sexOptions: [
          {
            label: '男 - 公开',
            value: 1
          },
          {
            label: '女 - 公开',
            value: 2
          },
          {
            label: '男 - 私密',
            value: 3
          },
          {
            label: '女 - 私密',
            value: 4
          }
        ]
      }
    },
    methods: {
      selectAvatar (e) {
        const file = e.target.files[0]
        if (!file) {
          this.$toast.error('图片选择失败')
          return
        }
        if (['image/jpeg', 'image/png', 'image/jpg'].indexOf(file.type) === -1) {
          this.$toast.error('仅支持 jpg / jpeg / png 格式的图片')
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
        const key = `user/${this.user.id}/avatar/${Date.now()}-${Math.random().toString(36).substring(3, 6)}`
        const imageApi = new ImageApi()
        try {
          await this.$store.dispatch('getUpToken')
          const formData = new FormData()
          formData.append('file', this.avatarSelector.file)
          formData.append('token', this.user.uptoken.upToken)
          formData.append('key', key)
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
          typeof e === 'string'
            ? this.$toast.error(e)
            : this.$toast.error('头像更新失败，请刷新网页重试')
        } finally {
          this.avatarSelector.loading = false
          this.cancelAvatarSelect()
        }
      },
      selectBanner (e) {
        const file = e.target.files[0]
        if (['image/jpeg', 'image/png', 'image/jpg'].indexOf(file.type) === -1) {
          this.$toast.error('仅支持 jpg / jpeg / png 格式的图片')
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
          this.$refs.bannerInput.value = ''
        })
      },
      async submitBannerChange () {
        if (this.bannerSelector.loading) {
          return
        }

        this.$toast.loading('上传中...')
        this.bannerSelector.loading = true
        const key = `user/${this.user.id}/banner/${Date.now()}-${Math.random().toString(36).substring(3, 6)}`
        const imageApi = new ImageApi()
        try {
          await this.$store.dispatch('getUpToken')
          const formData = new FormData()
          formData.append('file', this.bannerSelector.file)
          formData.append('token', this.user.uptoken.upToken)
          formData.append('key', key)
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
          typeof e === 'string'
            ? this.$toast.error(e)
            : this.$toast.error('背景更新失败，请刷新网页重试')
        } finally {
          this.bannerSelector.loading = false
          this.cancelAvatarSelect()
        }
      },
      saveSetting () {
        const birthday = this.settingForm.birthday ? new Date(this.settingForm.birthday).getTime() / 1000 : 0
        if (birthday && (Date.now() / 1000 - birthday < 315360000)) {
          this.$toast.error('小于10岁？不应该...')
          return
        }
        const api = new UserApi(this)
        const data = {
          nickname: this.settingForm.nickname,
          signature: this.settingForm.signature,
          sex: parseInt(this.settingForm.sex, 10) + (this.settingForm.sexSecret ? 2 : 0),
          birthday: birthday !== birthday ? 0 : birthday // eslint-disable-line
        }
        api.settingProfile(data).then(() => {
          this.$toast.success('设置成功')
          this.$store.commit('SET_USER_INFO', Object.assign({}, this.self, data))
          this.$store.commit('users/removeUser', this.slug)
        }).catch((err) => {
          this.$toast.error(err)
        })
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
        birthday: this.user.birthday ? this.$utils.timeLong(this.user.birthday * 1000).split(' ').shift() : ''
      }
    }
  }
</script>
