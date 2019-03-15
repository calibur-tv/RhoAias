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
    z-index: 0;
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
      @include border($color-avatar-border, 50%);
    }

    .submit-btn {
      position: absolute;
      top: 380px;
      left: 50%;
      width: 200px;
      margin-left: -100px;
    }

    .image-cropper-wrap {
      width: 300px;
      margin: 0 auto;
    }
  }

  .change-image-btn {
    display: inline-block;
    @include btn-empty($color-blue-normal);
  }

  .submit-banner-btn {
    display: inline-block;
    @include btn-empty(#fff);
  }

  .providers {
    padding-left: $container-padding;
    padding-right: $container-padding;
    margin-top: 15px;

    i {
      font-size: 24px;
      margin-right: 12px;
      color: $color-text-gray;
    }

    .icon-qq.is-bind {
      color: #3194d0;
    }

    .icon-wechat.is-bind {
      color: #42c02e;
    }

    .icon-phone.is-bind {
      color: $color-pink-deep;
    }
  }

  .btn-submit {
    margin-top: 20px;
  }
}
</style>

<template>
  <div id="user-setting">
    <div class="form-item">
      <p class="sub-title">
        背景：
      </p>
      <div
        :style="{
          backgroundImage: `url(${$resize(user.banner, {
            height: 120,
            mode: 2
          })})`
        }"
        class="banner-setting"
      >
        <template v-if="bannerSelector.data">
          <ImageCropper
            :init-image="bannerSelector.data"
            :uploading="bannerSelector.loading"
            :auto-size="true"
            @submit="submitBannerChange"
          />
          <el-button
            :disabled="bannerSelector.loading"
            class="cancel-btn"
            size="mini"
            type="info"
            round
            @click="cancelBannerSelect"
          >
            取消
          </el-button>
        </template>
        <div v-else class="submit-banner-btn file-input">
          点击更新背景
          <input
            ref="bannerInput"
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/x-png, image/gif"
            name="file"
            @change="selectBanner"
          >
        </div>
      </div>
    </div>
    <div class="hr" />
    <div class="form-item">
      <p class="sub-title">
        头像：
      </p>
      <div class="container avatar-setting">
        <v-drawer
          v-model="avatarSelector.showDrawer"
          header-text="头像裁剪"
          from="bottom"
          size="450px"
          @cancel="cancelAvatarSelect"
        >
          <ImageCropper
            v-if="avatarSelector.showDrawer"
            :init-image="avatarSelector.data"
            :uploading="avatarSelector.loading"
            :width="300"
            :height="300"
            type="avatar"
            @submit="submitAvatarChange"
          />
        </v-drawer>
        <div
          :style="{
            backgroundImage: `url(${$resize(user.avatar, { width: 80 })})`
          }"
          class="avatar"
        />
        <div class="change-image-btn file-input">
          点击更新头像
          <input
            ref="avatarInput"
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/x-png, image/gif"
            name="file"
            @change="selectAvatar"
          >
        </div>
      </div>
    </div>
    <div class="hr" />
    <div class="hr" />
    <div class="form-item">
      <p class="sub-title">
        绑定：
      </p>
      <div class="providers">
        <a
          :href="
            `https://api.calibur.tv/callback/oauth2/qq?from=bind&id=${
              user.id
            }&zone=${user.zone}`
          "
        >
          <i
            :class="{ 'is-bind': user.providers.bind_qq }"
            class="iconfont icon-qq"
          />
        </a>
        <a
          :href="
            ua.wechat
              ? `https://api.calibur.tv/callback/oauth2/weixin?from=bind&id=${
                user.id
              }&zone=${user.zone}`
              : 'javascript:;'
          "
        >
          <i
            :class="{ 'is-bind': user.providers.bind_wechat }"
            class="iconfont icon-wechat"
          />
        </a>
        <a href="javascript:;" @click="bindUserPhone">
          <i
            :class="{ 'is-bind': user.providers.bind_phone }"
            class="iconfont icon-phone"
          />
        </a>
      </div>
    </div>
    <div class="hr" />
    <div class="form-item">
      <p class="sub-title">
        其它：
      </p>
      <div class="container">
        <UserSettingForm />
      </div>
    </div>
    <v-drawer
      v-model="bindPhone.showInfoForm"
      from="bottom"
      header-text="填写信息"
      submit-text="确认"
      @submit="submitBindPhone"
    >
      <div class="container">
        <el-input
          v-model.trim="bindPhone.authCode"
          type="number"
          placeholder="短信验证码"
          auto-complete="off"
        />
        <br>
        <br>
        <el-input
          v-model.trim="bindPhone.password"
          type="text"
          placeholder="密码（6-16个字符组成，区分大小写）"
          auto-complete="off"
        />
      </div>
    </v-drawer>
  </div>
</template>

<script>
import ImageCropper from '~/components/common/ImageCropper'
import UserSettingForm from '~/components/user/UserSettingForm'
import mustAuth from '~/mixins/mustAuth'
import { settingImage, bindPhone, sendMessage } from '~/api/userApi'
import { uploadToQiniu } from '~/api/imageApi'

export default {
  name: 'UserSetting',
  components: {
    ImageCropper,
    UserSettingForm
  },
  mixins: [mustAuth],
  data() {
    return {
      avatarSelector: {
        loading: false,
        file: null,
        data: '',
        showDrawer: false
      },
      bannerSelector: {
        loading: false,
        file: null,
        data: ''
      },
      bindPhone: {
        phone: '',
        password: '',
        authCode: '',
        timeout: 0,
        showInfoForm: false,
        loadingBindPhone: false
      }
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    isMe() {
      return this.$store.state.login
        ? this.$route.params.zone === this.user.zone
        : false
    },
    ua() {
      return this.$store.state.ua
    }
  },
  methods: {
    selectAvatar(e) {
      const file = e.target.files[0]
      if (!file) {
        this.$toast.error('图片选择失败')
        return
      }
      if (
        ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].indexOf(
          file.type
        ) === -1
      ) {
        this.$toast.error('仅支持 jpg / jpeg / png / gif 格式的图片')
        return
      }
      const reader = new FileReader()
      this.avatarSelector.file = file
      reader.onload = evt => {
        this.avatarSelector.data = evt.target.result
        this.avatarSelector.showDrawer = true
      }
      reader.readAsDataURL(file)
    },
    cancelAvatarSelect() {
      this.avatarSelector.showDrawer = false
      this.avatarSelector.file = null
      this.avatarSelector.data = ''
      this.$nextTick(() => {
        this.$refs.avatarInput.value = ''
      })
    },
    async submitAvatarChange(formData) {
      if (this.avatarSelector.loading) {
        return
      }

      this.$toast.loading('上传中...')
      this.avatarSelector.loading = true
      const filename = this.$utils.createFileName({
        userId: this.user.id,
        type: 'avatar',
        file: this.avatarSelector.file
      })
      try {
        await this.$store.dispatch('getUpToken')
        formData.append('token', this.user.uptoken.upToken)
        formData.append('key', filename)
        const result = await uploadToQiniu(this, formData)
        await settingImage(this, {
          type: 'avatar',
          url: result.url
        })
        this.$store.commit('SET_USER_INFO', {
          avatar: `https://image.calibur.tv/${result.url}`
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
    selectBanner(e) {
      const file = e.target.files[0]
      if (
        ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].indexOf(
          file.type
        ) === -1
      ) {
        this.$toast.error('仅支持 jpg / jpeg / png / gif 格式的图片')
        return
      }
      const reader = new FileReader()
      this.bannerSelector.file = file
      reader.onload = evt => {
        this.bannerSelector.data = evt.target.result
      }
      reader.readAsDataURL(file)
    },
    cancelBannerSelect() {
      this.bannerSelector.file = null
      this.bannerSelector.data = ''
      this.$nextTick(() => {
        this.$refs.bannerInput.value = ''
      })
    },
    async submitBannerChange(formData) {
      if (this.bannerSelector.loading) {
        return
      }

      this.$toast.loading('上传中...')
      this.bannerSelector.loading = true
      const filename = this.$utils.createFileName({
        userId: this.user.id,
        type: 'banner',
        file: this.bannerSelector.file
      })
      try {
        await this.$store.dispatch('getUpToken')
        formData.append('token', this.user.uptoken.upToken)
        formData.append('key', filename)
        const result = await uploadToQiniu(this, formData)
        await settingImage(this, {
          type: 'banner',
          url: result.url
        })
        this.$store.commit('SET_USER_INFO', {
          banner: `https://image.calibur.tv/${result.url}`
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
    bindUserPhone() {
      if (this.user.providers.bind_phone) {
        return
      }
      if (this.bindPhone.timeout) {
        this.bindPhone.showInfoForm = true
        return
      }
      this.$prompt('请输入要绑定的手机号（11位）', '绑定手机', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^(0|86|17951)?(1)[0-9]{10}$/,
        inputErrorMessage: '请输入正确的手机号码'
      })
        .then(({ value }) => {
          this.bindPhone.phone = value
          this.$captcha({
            success: async ({ data }) => {
              try {
                await sendMessage(this, {
                  type: 'bind_phone',
                  phone_number: value,
                  geetest: data
                })
                this.bindPhone.showInfoForm = true
              } finally {
                this.bindPhone.timeout = 60
                const timer = setInterval(() => {
                  if (!--this.bindPhone.timeout) {
                    clearInterval(timer)
                  }
                }, 1000)
              }
            }
          })
        })
        .catch(() => {})
    },
    async submitBindPhone() {
      if (this.user.providers.bind_phone) {
        return
      }
      if (this.bindPhone.authCode.length !== 6) {
        return this.$toast.error('请输入正确的短信验证码')
      }
      if (this.bindPhone.password.length < 6) {
        return this.$toast.error('密码不能小于6位')
      }
      if (this.bindPhone.password.length > 16) {
        return this.$toast.error('密码不能大于16位')
      }
      if (this.bindPhone.loadingBindPhone) {
        return
      }
      this.bindPhone.loadingBindPhone = true
      try {
        await bindPhone(this, {
          id: this.user.id,
          phone: this.bindPhone.phone,
          password: this.bindPhone.password,
          authCode: this.bindPhone.authCode
        })
        this.$toast.success('手机号绑定成功').then(() => {
          this.bindPhone.showInfoForm = false
          window.location.reload()
        })
      } finally {
        this.bindPhone.loadingBindPhone = false
      }
    }
  }
}
</script>
