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
          padding-left: 60px;
        }
      }

      .label {
        text-align: left;
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 60px;
        font-size: 16px;
        line-height: 48px;
      }

      .other-form-wrap {
        position: relative;

        .mint-radiolist {
          padding-left: 48px;
        }

        .mint-radiolist-title {
          display: none;
        }
      }

      #signature {
        min-height: 120px;
        padding-left: 60px;
        line-height: 26px;
        padding-top: 12px;
      }
    }

    .banner-setting {
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
      margin-bottom: -15px;

      .file-input {
        margin-top: 60px;
        margin-left: 10px;
        margin-right: 10px;
      }

      .cancel-btn {
        position: absolute;
        right: 100px;
        bottom: 10px;
      }

      .submit-btn {
        position: absolute;
        right: 15px;
        bottom: 10px;
      }
    }

    .avatar-setting {

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

      .cancel-btn,
      .submit-btn {
        position: absolute;
        top: 50%;
        margin-top: -14px;
      }

      .cancel-btn {
        left: 120px;
      }

      .submit-btn {
        left: 190px;
      }
    }

    .change-image-btn {
      display: inline-block;
      @include btn-empty($color-blue-normal);
    }

    .submit-banner-btn {
      display: inline-block;
      @include btn-empty(#fff)
    }

    .btn-submit {
      margin-top: 20px;
    }
  }
</style>

<template>
  <div id="user-setting">
    <div class="form-item">
      <p class="sub-title">背景：</p>
      <div class="banner-setting" :style="{ backgroundImage: `url(${$resize(user.banner, { height: 120, mode: 2 })})` }">
        <template v-if="bannerSelector.data">
          <image-cropper
            :init-image="bannerSelector.data"
            :uploading="bannerSelector.loading"
            :auto-size="true"
            @submit="submitBannerChange"
          ></image-cropper>
          <el-button
            class="cancel-btn"
            size="mini"
            type="info"
            :disabled="bannerSelector.loading"
            round
            @click="cancelBannerSelect"
          >取消</el-button>
        </template>
        <div class="submit-banner-btn file-input" v-else>
          点击更新背景
          <input type="file" accept="image/png, image/jpeg, image/jpg, image/x-png, image/gif" name="file" ref="bannerInput" @change="selectBanner">
        </div>
      </div>
    </div>
    <div class="hr"></div>
    <div class="form-item">
      <p class="sub-title">头像：</p>
      <div class="container avatar-setting">
        <template v-if="avatarSelector.data">
          <image-cropper
            :init-image="avatarSelector.data"
            :uploading="avatarSelector.loading"
            :width="80"
            :height="80"
            type="avatar"
            @submit="submitAvatarChange"
          ></image-cropper>
          <el-button
            class="cancel-btn"
            size="mini"
            type="info"
            :disabled="avatarSelector.loading"
            round
            @click="cancelAvatarSelect"
          >取消</el-button>
        </template>
        <template v-else>
          <div class="avatar" :style="{ backgroundImage: `url(${$resize(user.avatar, { width: 80 })})` }"></div>
          <div class="change-image-btn file-input">
            点击更新头像
            <input type="file" accept="image/png, image/jpeg, image/jpg, image/x-png, image/gif" name="file" ref="avatarInput" @change="selectAvatar">
          </div>
        </template>
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
            maxlength="150"
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
  import ImageCropper from '~/components/common/ImageCropper'

  export default {
    name: 'page-user-setting',
    components: {
      ImageCropper
    },
    computed: {
      user () {
        return this.$store.state.user
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
        if (['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].indexOf(file.type) === -1) {
          this.$toast.error('仅支持 jpg / jpeg / png / gif 格式的图片')
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
      async submitAvatarChange (formData) {
        if (this.avatarSelector.loading) {
          return
        }

        this.$toast.loading('上传中...')
        this.avatarSelector.loading = true
        const filename = this.$utils.createFileName({
          userId: this.user.id,
          type: 'avatar',
          id: 0,
          file: this.avatarSelector.file
        })
        const imageApi = new ImageApi()
        try {
          await this.$store.dispatch('getUpToken')
          formData.append('token', this.user.uptoken.upToken)
          formData.append('key', filename)
          const result = await imageApi.uploadToQiniu(formData)
          const userApi = new UserApi(this)
          await userApi.settingImage({
            type: 'avatar',
            url: result.key
          })
          this.$store.commit('SET_USER_INFO', {
            avatar: `${this.$cdn.image}${result.key}`
          })
          this.$toast.success('头像更新成功')
        } catch (e) {
          typeof e === 'string'
            ? this.$toast.error(e)
            : this.$toast.error('头像更新失败，请刷新网页重试或选择其他图片')
        } finally {
          this.avatarSelector.loading = false
          this.cancelAvatarSelect()
        }
      },
      selectBanner (e) {
        const file = e.target.files[0]
        if (['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].indexOf(file.type) === -1) {
          this.$toast.error('仅支持 jpg / jpeg / png / gif 格式的图片')
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
      async submitBannerChange (formData) {
        if (this.bannerSelector.loading) {
          return
        }

        this.$toast.loading('上传中...')
        this.bannerSelector.loading = true
        const filename = this.$utils.createFileName({
          userId: this.user.id,
          type: 'banner',
          id: 0,
          file: this.bannerSelector.file
        })
        const imageApi = new ImageApi()
        try {
          await this.$store.dispatch('getUpToken')
          formData.append('token', this.user.uptoken.upToken)
          formData.append('key', filename)
          const result = await imageApi.uploadToQiniu(formData)
          const userApi = new UserApi(this)
          await userApi.settingImage({
            type: 'banner',
            url: result.key
          })
          this.$store.commit('SET_USER_INFO', {
            banner: `${this.$cdn.image}${result.key}`
          })
          this.$toast.success('背景更新成功')
        } catch (e) {
          typeof e === 'string'
            ? this.$toast.error(e)
            : this.$toast.error('背景更新失败，请刷新网页重试或选择其他图片')
        } finally {
          this.bannerSelector.loading = false
          this.cancelBannerSelect()
        }
      },
      saveSetting () {
        const nicknameLength = this.settingForm.nickname.replace(/([\u4e00-\u9fa5])/g, 'aa').trim().length
        if (nicknameLength > 14 || nicknameLength < 1) {
          this.$toast.error('昵称长度不符合要求')
          return
        }
        const api = new UserApi(this)
        const data = {
          nickname: this.settingForm.nickname,
          signature: this.settingForm.signature,
          sex: parseInt(this.settingForm.sex, 10) + (this.settingForm.sexSecret ? 2 : 0),
          birthday: 0
        }
        api.settingProfile(data).then(() => {
          this.$toast.success('设置成功')
          this.$store.commit('SET_USER_INFO', Object.assign({}, this.user, data))
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
