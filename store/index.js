import Vue from 'vue'
import { getLoginUser } from '~/api/userApi'
import { getUpToken } from '~/api/imageApi'
import { getPageData } from '~/api/carouselApi'

export const state = () => ({
  user: null,
  login: false,
  ua: {
    ios: false,
    android: false,
    wechat: false,
    qq: false,
    tencent: false,
    alipay: false,
    weibo: false,
    pc: false,
    others: false
  },
  haveAuthToken: false,
  OAuthData: null,
  from: ''
})

export const mutations = {
  SET_USER(state, user) {
    const isSigned = !!user.id
    state.user = user
    state.login = isSigned
    state.haveAuthToken = isSigned
  },
  SET_USER_INFO(state, data) {
    Object.keys(data).forEach(key => {
      state.user[key] = data[key]
    })
  },
  SET_AUTH_TOKEN(state, token) {
    state.haveAuthToken = !!token
  },
  SET_UA(state, ua) {
    state.ua = {
      ios: /iphone|ipad|ipod/.test(ua),
      android: /android/.test(ua),
      wechat: /micromessenger/.test(ua),
      qq: /qq/.test(ua),
      tencent: /mqqbrowser|qq|micromessenger/.test(ua),
      alipay: /alipayclient/.test(ua),
      weibo: /weibo/i.test(ua),
      pc: !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        ua
      ),
      others: /windows phone|blackberry/.test(ua)
    }
  },
  SET_OAUTH_DATA(state, data) {
    state.OAuthData = data
  },
  UPDATE_USER_INFO(state, { key, value }) {
    Vue.set(state.user, key, value)
  },
  UPDATE_USER_EXP(state, score) {
    if (!state.login || !score) {
      return
    }
    // level * (level + 10) 是经验计算公式
    if (score > 0) {
      if (state.user.exp.have_exp + score >= state.user.next_level_exp) {
        const newLevel = state.user.exp.level + 1
        state.user.exp.level = newLevel
        state.user.exp.have_exp =
          state.user.exp.have_exp + score - state.user.next_level_exp
        state.user.exp.next_level_exp = newLevel * newLevel + newLevel * 10
      } else {
        state.user.exp.have_exp = state.user.exp.have_exp + score
      }
    } else if (state.user.exp.have_exp + score < 0) {
      const newLevel = state.user.exp.level - 1
      const lastTotalExp = newLevel * newLevel + newLevel * 10
      state.user.exp.have_exp = lastTotalExp + state.user.exp.have_exp + score
      state.user.exp.next_level_exp = lastTotalExp
    } else {
      state.user.exp.have_exp = state.user.exp.have_exp + score
    }
  },
  USE_COIN(state, value) {
    if (!state.login) {
      return
    }
    state.user.pocket -= value
  },
  SET_SOURCE(state, from) {
    state.from = from
  }
}

export const actions = {
  async getOauthData({ commit }) {
    const ua = (window.navigator.userAgent || '').toLowerCase()
    if (/mqqbrowser|qq|micromessenger/.test(ua)) {
      const data = await getPageData(this, window.location.href)
      commit('SET_OAUTH_DATA', data)
    }
  },
  async initAuth({ state, commit }) {
    if (state.user) {
      return true
    }
    if (!state.haveAuthToken) {
      commit('SET_USER', {})
      return false
    }
    try {
      const data = await getLoginUser(this)
      commit('SET_USER', data)
      return true
    } catch (e) {
      commit('SET_USER', {})
      return false
    }
  },
  async getUpToken({ state, commit }) {
    if (!state.login) {
      return
    }
    if (state.user.uptoken.expiredAt <= parseInt(Date.now() / 1000, 10)) {
      const data = await getUpToken()
      commit('UPDATE_USER_INFO', {
        key: 'uptoken',
        value: data
      })
    }
  }
}
