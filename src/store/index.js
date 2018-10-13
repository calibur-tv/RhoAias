import Vue from "vue";
import Vuex from "vuex";
import parseToken from "~/assets/js/parseToken";
import UserApi from "~/api/userApi";
import ImageApi from "~/api/imageApi";
import bangumi from "./bangumi";
import post from "./post";
import video from "./video";
import users from "./users";
import cartoonRole from "./cartoonRole";
import image from "./image";
import comment from "./comment";
import homepage from "./homepage";
import search from "./search";
import editor from "./editor";
import score from "./score";
import flow from "./flow";
import world from "./flow";
import question from "./question";
import app from "./app";

Vue.use(Vuex);

export function createStore() {
  return new Vuex.Store({
    strict: process.env.NODE_ENV !== "production",
    state: () => ({
      user: null,
      login: false,
      ua: {
        ios: false,
        android: false,
        wechat: false,
        qq: false,
        alipay: false,
        weibo: false,
        pc: false
      }
    }),
    mutations: {
      SET_SSR_CTX(state, { ctx }) {
        const userAgent = ctx.header["user-agent"].toLowerCase();
        state.ssrContext = ctx;
        state.ua = {
          ios: /iphone|ipad|ipod/.test(userAgent),
          android: /android/.test(userAgent),
          wechat: /micromessenger/.test(userAgent),
          qq: /qq\//.test(userAgent),
          alipay: /alipayclient/.test(userAgent),
          weibo: /weibo/i.test(userAgent),
          pc: !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            userAgent
          )
        };
      },
      SET_USER(state, user) {
        state.user = user;
        state.login = true;
      },
      SET_USER_INFO(state, data) {
        Object.keys(data).forEach(key => {
          state.user[key] = data[key];
        });
      },
      UPDATE_USER_INFO(state, { key, value }) {
        state.user[key] = value;
      },
      USE_COIN(state) {
        state.user.coin && state.user.coin--;
      },
      UPDATE_USER_EXP(state, score) {
        if (!state.user) {
          return;
        }
        if (score > 0) {
          if (state.user.exp.have_exp + score >= state.user.next_level_exp) {
            const newLevel = state.user.exp.level + 1;
            state.user.exp.level = newLevel;
            state.user.exp.have_exp =
              state.user.exp.have_exp + score - state.user.next_level_exp;
            state.user.exp.next_level_exp = newLevel * newLevel + newLevel * 10;
          } else {
            state.user.exp.have_exp = state.user.exp.have_exp + score;
          }
        } else {
          if (state.user.exp.have_exp + score < 0) {
            const newLevel = state.user.exp.level - 1;
            const lastTotalExp = newLevel * newLevel + newLevel * 10;
            state.user.exp.have_exp =
              lastTotalExp + state.user.exp.have_exp + score;
            state.user.exp.next_level_exp = lastTotalExp;
          } else {
            state.user.exp.have_exp = state.user.exp.have_exp + score;
          }
        }
      }
    },
    actions: {
      async initAuth({ commit }, { ctx, must, admin }) {
        const token = parseToken(ctx);
        const throwError = code => {
          const error = new Error();
          error.code = code || 401;
          throw error;
        };
        if ((must || admin) && !token) {
          throwError(401);
        }
        if (!token) {
          commit("SET_SSR_CTX", ctx);
          return;
        }
        const api = new UserApi(ctx);
        try {
          const user = await api.getLoginUser();
          if ((admin || must) && !user) {
            throwError(401);
          }
          if (admin && (!user || !user.is_admin)) {
            throwError(403);
          }
          commit("SET_SSR_CTX", ctx);
          commit("SET_USER", user);
        } catch (e) {
          // do nothing
          return throwError(e.code);
        }
      },
      async getUpToken({ state, commit }) {
        if (state.user.uptoken.expiredAt <= parseInt(Date.now() / 1000, 10)) {
          const api = new ImageApi();
          const data = await api.getUpToken();
          data &&
            commit("SET_USER_INFO", {
              uptoken: data
            });
        }
      },
      async getNotification({ commit }, ctx) {
        const api = new UserApi(ctx);
        const data = await api.getNotificationCount();
        data &&
          commit("SET_USER_INFO", {
            notification: data
          });
      }
    },
    getters: {},
    modules: {
      bangumi,
      post,
      users,
      video,
      cartoonRole,
      image,
      comment,
      homepage,
      search,
      editor,
      score,
      flow,
      world,
      question,
      app
    }
  });
}
