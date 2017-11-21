import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    state () {
      return {
        user: null,
        ssrContext: null
      }
    },
    mutations: {
      SET_SSR_CTX (state, data) {
        state.ssrContext = data
      }
    },
    actions: {},
    getters: {},
    modules: {}
  })
}
