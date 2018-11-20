<style lang="scss">
.user-setting-form {
  .tips {
    background-color: #f4f4f5;
    color: #909399;
    margin-bottom: 20px;
    padding: 8px 16px;
    border-radius: 4px;

    p {
      font-size: 12px;
      line-height: 18px;
      margin-bottom: 5px;
      margin-top: 5px;
    }
  }

  .bottom-line {
    input,
    textarea {
      border-top: none;
      border-left: none;
      border-right: none;
      padding-left: 0;
    }

    textarea {
      margin-top: 5px;
    }
  }

  .select-btn {
    height: 40px;
    overflow: hidden;

    button {
      width: 100%;
      color: #606266;
      text-align: left;
    }
  }

  .state-wrap {
    float: right;
    margin-top: 4px;

    .state-label {
      float: left;
      line-height: 32px;
      margin-right: 10px;
      color: #606266;
    }

    .mint-switch {
      overflow: hidden;
    }
  }

  .submit-btn {
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>

<template>
  <el-form
    ref="form"
    :disabled="submitting"
    :model="user"
    :rules="rule"
    label-width="50px"
    class="user-setting-form"
  >
    <div class="tips">
      <p>填写正确的性别和生日有助于网站对你番剧喜好的分析，在未来我们有可能根据你的喜好来推荐合适的番剧</p>
      <p>如果你担心自己的性别和生日被其他用户知道，可以勾选<strong>私密</strong>，这样我们只会在推荐系统中用到你的数据</p>
    </div>
    <el-form-item
      label="昵称"
      prop="nickname"
    >
      <el-input 
        v-model="nickname" 
        class="bottom-line"/>
    </el-form-item>
    <el-form-item label="生日">
      <no-ssr>
        <mt-datetime-picker
          ref="birthPicker"
          v-model="birthday"
          :start-date="beginTime"
          :end-date="endTime"
          type="date"
          year-format="{value}年"
          month-format="{value}月"
          date-format="{value}日"
        />
      </no-ssr>
      <div class="state-wrap">
        <div class="state-label">状态：{{ birthSecret ? '私密' : '公开' }}</div>
        <mt-switch v-model="birthSecret"/>
      </div>
      <div class="select-btn">
        <button
          type="button"
          @click="openBirthPicker"
          v-text="selectedBirthLabel"
        />
      </div>
    </el-form-item>
    <el-form-item label="性别">
      <div class="state-wrap">
        <div class="state-label">状态：{{ sexSecret ? '私密' : '公开' }}</div>
        <mt-switch v-model="sexSecret"/>
      </div>
      <div class="select-btn">
        <v-popover :actions="sexActions">
          <button
            type="button"
            v-text="selectedSexLabel"
          />
        </v-popover>
      </div>
    </el-form-item>
    <el-form-item
      label="签名"
      prop="signature"
    >
      <el-input
        v-model="signature"
        :rows="5"
        class="bottom-line"
        type="textarea"
        placeholder="用简单的言语，表达深刻的心"
      />
    </el-form-item>
    <el-button
      :loading="submitting"
      type="primary"
      size="small"
      class="submit-btn"
      @click="submit"
    >提交</el-button>
  </el-form>
</template>

<script>
import Api from '~/api/userApi'
import VPopover from '~/components/common/Popover'
import { Switch } from 'mint-ui'

export default {
  name: 'UserSettingForm',
  components: {
    VPopover,
    'mt-switch': Switch
  },
  data() {
    const validateNickname = (rule, value, callback) => {
      const length = value.replace(/([\u4e00-\u9fa5])/g, 'aa').trim().length
      if (!length) {
        callback(new Error('昵称不能为空'))
      } else if (length < 2) {
        callback(new Error('昵称至少为2个字符'))
      } else if (length > 14) {
        callback(new Error('昵称不能超过14个字符'))
      }
      callback()
    }
    const validateSignature = (rule, value, callback) => {
      if (value.length > 150) {
        callback(new Error('签名最多 150 个字'))
      }
      callback()
    }
    const validateBirthday = (rule, value, callback) => {
      const setTs = value.getTime()
      const curTs = Date.now()
      if (setTs >= curTs) {
        callback(new Error('。。。'))
      } else if (curTs - setTs < 315360000000) {
        callback(new Error('你应该大于10岁了吧...?'))
      } else if (curTs - setTs > 1576800000000) {
        callback(new Error('你应该小于50岁的吧...?'))
      }
      callback()
    }
    return {
      beginTime: new Date(new Date().getFullYear() - 40, 0, 1),
      endTime: new Date(new Date().getFullYear() - 10, 11, 31),
      submitting: false,
      sexMap: ['点击选择', '男', '女', '伪娘', '药娘', '扶她'],
      rule: {
        nickname: [{ validator: validateNickname, trigger: 'submit' }],
        signature: [{ validator: validateSignature, trigger: 'submit' }],
        birthday: [{ validator: validateBirthday, trigger: 'submit' }]
      }
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    sex() {
      return this.user.sex
    },
    nickname: {
      get() {
        return this.user.nickname
      },
      set(value) {
        this.$store.commit('UPDATE_USER_INFO', {
          key: 'nickname',
          value
        })
      }
    },
    birthday: {
      get() {
        if (/-/.test(this.user.birthday)) {
          return new Date(this.user.birthday.replace(/-/g, '/'))
        }
        return new Date(this.user.birthday)
      },
      set(value) {
        this.$store.commit('UPDATE_USER_INFO', {
          key: 'birthday',
          value
        })
      }
    },
    birthSecret: {
      get() {
        return this.user.birthSecret
      },
      set(value) {
        this.$store.commit('UPDATE_USER_INFO', {
          key: 'birthSecret',
          value
        })
      }
    },
    sexSecret: {
      get() {
        return this.user.sexSecret
      },
      set(value) {
        this.$store.commit('UPDATE_USER_INFO', {
          key: 'sexSecret',
          value
        })
      }
    },
    signature: {
      get() {
        return this.user.signature
      },
      set(value) {
        this.$store.commit('UPDATE_USER_INFO', {
          key: 'signature',
          value
        })
      }
    },
    sexActions() {
      return [
        {
          name: this.sexMap[1],
          method: () => {
            this.$store.commit('UPDATE_USER_INFO', {
              key: 'sex',
              value: 1
            })
          }
        },
        {
          name: this.sexMap[2],
          method: () => {
            this.$store.commit('UPDATE_USER_INFO', {
              key: 'sex',
              value: 2
            })
          }
        },
        {
          name: this.sexMap[3],
          method: () => {
            this.$store.commit('UPDATE_USER_INFO', {
              key: 'sex',
              value: 3
            })
          }
        },
        {
          name: this.sexMap[4],
          method: () => {
            this.$store.commit('UPDATE_USER_INFO', {
              key: 'sex',
              value: 4
            })
          }
        },
        {
          name: this.sexMap[5],
          method: () => {
            this.$store.commit('UPDATE_USER_INFO', {
              key: 'sex',
              value: 5
            })
          }
        }
      ]
    },
    selectedSexLabel() {
      return this.sexMap[this.sex]
    },
    selectedBirthLabel() {
      const date = this.birthday
      if (/1970 08:00:00 GMT\+0800/.test(date)) {
        return '未设置'
      }
      return `${date.getFullYear()}年${date.getMonth() +
        1}月${date.getDate()}日`
    }
  },
  methods: {
    openBirthPicker() {
      this.$refs.birthPicker.open()
    },
    submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          if (this.submitting) {
            return
          }
          this.submitting = true
          const api = new Api(this)
          try {
            await api.settingProfile({
              nickname: this.nickname,
              signature: this.signature,
              birthday: new Date(this.birthday).getTime() / 1000,
              birth_secret: this.birthSecret,
              sex_secret: this.sexSecret,
              sex: this.sex
            })
            this.$toast.success('设置成功')
          } catch (err) {
            this.$toast.error(err)
          } finally {
            this.submitting = false
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>
