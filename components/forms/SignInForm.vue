<style lang="scss">
.sign-in-form {
  input {
    border: 0;
    padding: 0;
    border-bottom: 1px solid $color-gray-normal;
  }

  .submit-btn {
    width: 100%;
  }

  .others {
    @extend %clearfix;

    a {
      font-size: 12px;
    }

    .fl {
      float: left;
    }

    .fr {
      float: right;
    }
  }

  .watch-pwd {
    position: absolute;
    right: 11px;
    top: 11px;
    font-size: 18px;
    color: $color-gray-deep;
  }

  .providers {
    margin-bottom: 15px;
    margin-top: -7px;
    text-align: right;

    span {
      font-size: 12px;
      line-height: 23px;
      float: left;
    }

    i {
      font-size: 20px;
      vertical-align: middle;
      margin-left: 10px;
      color: $color-text-normal;
      cursor: pointer;
    }

    .icon-qq:hover {
      color: #3194d0;
    }

    .icon-wechat-copy:hover {
      color: #42c02e;
    }
  }
}
</style>

<template>
  <div class="sign-in-form">
    <img
      :src="
        $resize('https://image.calibur.tv/owner/logo/calibur-pink-new.png', {
          width: 500,
          height: 200
        })
      "
      class="logo"
      alt="sign-logo"
    />
    <el-form ref="form" :model="form" :rules="rule">
      <el-form-item prop="access">
        <el-input
          v-model="form.access"
          type="text"
          placeholder="手机（填写常用手机号，用于登录）"
        />
      </el-form-item>
      <el-form-item prop="secret">
        <el-input
          v-model="form.secret"
          :type="watchPwd ? 'text' : 'password'"
          placeholder="密码（6-16个字符组成，区分大小写）"
        />
        <button
          v-if="form.secret.length > 5"
          class="watch-pwd"
          type="button"
          @click="watchPwd = !watchPwd"
        >
          <i class="iconfont icon-yuedu" />
        </button>
      </el-form-item>
      <div class="providers">
        <a :href="qqRegisterLink">
          <i class="iconfont icon-qq" />
        </a>
        <a v-if="ua.wechat" :href="wechatRegisterLink">
          <i class="iconfont icon-wechat" />
        </a>
      </div>
      <el-form-item>
        <el-button
          :loading="loading"
          class="submit-btn"
          type="primary"
          @click="submitForm"
        >
          登录
        </el-button>
      </el-form-item>
    </el-form>
    <div class="others">
      <a class="fl" @click="showReset">忘记密码?></a>
      <a class="fr" @click="showRegister">点击注册»</a>
    </div>
  </div>
</template>

<script>
import { login } from '~/api/userApi'

export default {
  name: 'SignInForm',
  props: {
    inviteCode: {
      type: String,
      default: ''
    }
  },
  data() {
    const validateAccess = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请填写手机号'))
      }
      if (value.length !== 11) {
        return callback(new Error('请填写11位手机号'))
      }
      callback()
    }
    const validateSecret = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请填写登录密码'))
      }
      if (value.length < 6) {
        return callback(new Error('密码不能小于6位'))
      }
      if (value.length > 16) {
        return callback(new Error('密码不能大于16位'))
      }
      callback()
    }
    return {
      form: {
        access: '',
        secret: '',
        remember: true
      },
      rule: {
        access: [{ validator: validateAccess, trigger: 'blur' }],
        secret: [{ validator: validateSecret, trigger: 'blur' }]
      },
      loading: false,
      watchPwd: false
    }
  },
  computed: {
    ua() {
      return this.$store.state.ua
    },
    qqRegisterLink() {
      let link = 'https://api.calibur.tv/callback/oauth2/qq?from=sign'
      if (this.inviteCode) {
        link = `${link}&invite=${this.inviteCode}`
      }
      return link
    },
    wechatRegisterLink() {
      let link = 'https://api.calibur.tv/callback/oauth2/weixin?from=sign'
      if (this.inviteCode) {
        link = `${link}&invite=${this.inviteCode}`
      }
      return link
    }
  },
  methods: {
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.login()
        } else {
          return false
        }
      })
    },
    login() {
      if (this.loading) {
        return
      }
      this.loading = true
      this.$captcha({
        ctx: this,
        success: ({ data }) => {
          login(this, {
            access: this.form.access,
            secret: this.form.secret,
            remember: this.form.remember,
            geetest: data
          })
            .then(token => {
              this.$cookie.set('JWT-TOKEN', token, {
                expires: 365
              })
              window.location.reload()
            })
            .catch(() => {
              this.loading = false
            })
        },
        close: () => {
          this.loading = false
        }
      })
    },
    showReset() {
      this.$emit('to-reset')
      this.$refs.form.resetFields()
    },
    showRegister() {
      this.$emit('to-register')
      this.$refs.form.resetFields()
    },
    showOAuth() {
      this.$toast.info('暂未开放第三方登录')
    }
  }
}
</script>
