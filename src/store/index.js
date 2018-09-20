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
      }
    },
    actions: {
      async init({ commit }, { ctx, must, admin }) {
        const cookie = ctx.header.cookie;
        const throwError = code => {
          const error = new Error();
          error.code = code || 401;
          throw error;
        };
        commit("SET_SSR_CTX", ctx);
        if (cookie) {
          console.log(`我有cookie`);
          let token = "";
          cookie.split("; ").forEach(item => {
            const temp = item.split("=");
            if (temp[0] === "JWT-TOKEN") {
              token = temp[1];
            }
          });
          if (token) {
            console.log(`我有token`);
            const api = new UserApi(ctx);
            try {
              const user = await api.getLoginUser();
              if (user) {
                if (admin && !user.is_admin) {
                  return throwError(403);
                }
                commit("SET_USER", user);
              } else if (must) {
                return throwError();
              }
            } catch (e) {
              // do nothing
              console.log(111111);
              return throwError(e.code);
            }
          } else if (must) {
            return throwError();
          }
        } else if (must) {
          console.log(`我在这里啦`);
          return throwError();
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
      question
    }
  });
}
