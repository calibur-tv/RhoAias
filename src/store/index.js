import Vue from "vue";
import Vuex from "vuex";
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
          ios: userAgent.match(/iphone|ipad|ipod/) !== null,
          android: userAgent.match(/android/) !== null,
          wechat: userAgent.match(/micromessenger/) !== null,
          qq: userAgent.match(/qq\//) !== null,
          alipay: userAgent.match(/alipayclient/) !== null,
          weibo: userAgent.match(/weibo/i) !== null,
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
      async init({ commit }, ctx) {
        const cookie = ctx.header.cookie;
        commit("SET_SSR_CTX", ctx);
        if (cookie) {
          let token = "";
          cookie.split("; ").forEach(item => {
            const temp = item.split("=");
            if (temp[0] === "JWT-TOKEN") {
              token = temp[1];
            }
          });
          if (token) {
            const api = new UserApi(ctx);
            try {
              const user = await api.getLoginUser();
              if (user) {
                commit("SET_USER", user);
              }
            } catch (e) {
              // do nothing
            }
          }
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
