import Vue from "vue";
import Router from "vue-router";
import Meta from "vue-meta";

Vue.use(Router);
Vue.use(Meta, {
  keyName: "head",
  attribute: "data-n-head",
  ssrAttribute: "data-n-head-ssr",
  tagIDKeyName: "hid"
});

export function createRouter() {
  return new Router({
    mode: "history",
    base: "/",
    scrollBehavior(to, from, savedPosition) {
      // savedPosition 只有在 popstate 导航（如按浏览器的返回按钮）时可以获取。
      if (savedPosition) {
        return savedPosition;
      }
      return { x: 0, y: 0 };
    },
    routes: [
      {
        path: "/",
        component: () => import("~/layouts/default"),
        meta: { useAuth: true },
        children: [
          {
            path: "",
            name: "homepage",
            component: () => import("~/views/index")
          },
          {
            path: "world",
            component: () => import("~/views/world/index"),
            children: [
              {
                path: "",
                redirect: "post"
              },
              {
                path: "post",
                name: "world-post",
                component: () => import("~/views/world/post")
              },
              {
                path: "pins",
                name: "world-image",
                component: () => import("~/views/world/image")
              },
              {
                path: "review",
                name: "world-score",
                component: () => import("~/views/world/score")
              },
              {
                path: "qaq",
                name: "world-question",
                component: () => import("~/views/world/question")
              }
            ]
          },
          {
            path: "search",
            name: "search-index",
            component: () => import("~/views/search/index")
          },
          {
            path: "bangumi/:id(\\d+)",
            component: () => import("~/views/bangumi/show/layout"),
            children: [
              {
                path: "",
                name: "bangumi-show",
                redirect: "post"
              },
              {
                path: "post",
                name: "bangumi-post",
                component: () => import("~/views/bangumi/show/post")
              },
              {
                path: "video",
                name: "bangumi-video",
                component: () => import("~/views/bangumi/show/video")
              },
              {
                path: "cartoon",
                name: "bangumi-cartoon",
                component: () => import("~/views/bangumi/show/cartoon")
              },
              {
                path: "role",
                name: "bangumi-role",
                component: () => import("~/views/bangumi/show/role")
              },
              {
                path: "pins",
                name: "bangumi-image",
                component: () => import("~/views/bangumi/show/image")
              },
              {
                path: "review",
                name: "bangumi-score",
                component: () => import("~/views/bangumi/show/score")
              },
              {
                path: "qaq",
                name: "bangumi-question",
                component: () => import("~/views/bangumi/show/question")
              }
            ]
          },
          {
            path: "bangumi/timeline",
            name: "bangumi-timeline",
            component: () => import("~/views/bangumi/time")
          },
          {
            path: "bangumi/news",
            name: "bangumi-news",
            component: () => import("~/views/bangumi/news")
          },
          {
            path: "bangumi/tags/:id?",
            name: "bangumi-tags",
            component: () => import("~/views/bangumi/tags")
          },
          {
            path: "user/:zone",
            component: () => import("~/views/user/show/layout"),
            children: [
              {
                path: "",
                name: "user-show",
                redirect: "bangumi"
              },
              {
                path: "bangumi",
                name: "user-bangumi",
                component: () => import("~/views/user/show/bangumi")
              },
              {
                path: "post",
                name: "user-post",
                component: () => import("~/views/user/show/post")
              },
              {
                path: "pins",
                name: "user-image",
                component: () => import("~/views/user/show/image")
              },
              {
                path: "review",
                name: "user-score",
                component: () => import("~/views/user/show/score")
              },
              {
                path: "qaq",
                name: "user-question",
                component: () => import("~/views/user/show/question")
              },
              {
                path: "role",
                name: "user-role",
                component: () => import("~/views/user/show/role")
              },
              {
                path: "draft",
                name: "user-draft",
                component: () => import("~/views/user/show/draft")
              }
            ]
          },
          {
            path: "user/:zone/setting",
            name: "user-setting",
            component: () => import("~/views/user/setting")
          },
          {
            path: "me/invite",
            name: "user-invite",
            component: () => import("~/views/user/invite")
          },
          {
            path: "post/:id(\\d+)",
            name: "post-show",
            component: () => import("~/views/post/show")
          },
          {
            path: "notification/list",
            name: "notification-list",
            component: () => import("~/views/notification/list")
          },
          {
            path: "about/hello",
            name: "hello",
            component: () => import("~/views/about/hello")
          },
          {
            path: "about/invite/:id(\\d+)",
            name: "invite-user",
            component: () => import("~/views/about/invite")
          },
          {
            path: "video/:id(\\d+)",
            component: () => import("~/views/video/show")
          },
          {
            path: "role/trending",
            component: () => import("~/views/role/trending")
          },
          {
            path: "app/download",
            name: "download-app",
            component: () => import("~/views/market/download")
          },
          {
            path: "role/:id(\\d+)",
            name: "role-show",
            component: () => import("~/views/role/show")
          },
          {
            path: "pin/:id(\\d+)",
            name: "image-show",
            component: () => import("~/views/image/show")
          },
          {
            path: "qaq/:id(\\d+)",
            name: "question-show",
            component: () => import("~/views/question/show")
          },
          {
            path: "soga/:id(\\d+)",
            name: "answer-show",
            component: () => import("~/views/answer/show")
          },
          {
            path: "review/:id(\\d+)",
            name: "score-show",
            component: () => import("~/views/score/show")
          }
        ]
      },
      {
        path: "/review",
        component: () => import("~/layouts/write"),
        meta: { useAuth: true },
        children: [
          {
            path: "create",
            name: "score-create",
            component: () => import("~/views/score/create")
          },
          {
            path: "edit/:id(\\d+)",
            name: "score-edit",
            component: () => import("~/views/score/create")
          }
        ]
      },
      {
        path: "/app",
        component: () => import("~/layouts/empty"),
        children: [
          {
            path: "handbook",
            name: "app-handbook",
            component: () => import("~/views/app/handbook")
          },
          {
            path: "invite",
            name: "app-invite",
            meta: { useAuth: true },
            component: () => import("~/views/app/invite")
          },
          {
            path: "report",
            name: "app-report",
            component: () => import("~/views/app/report")
          }
        ]
      }
      // {
      //   path: "/campaign",
      //   component: () => import("~/layouts/empty"),
      //   meta: { useAuth: false },
      //   children: [
      //     {
      //       path: "canvas",
      //       component: () => import("~/views/campaign/canvas")
      //     }
      //   ]
      // }
    ]
  });
}
