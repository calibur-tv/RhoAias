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
      if (savedPosition) {
        return savedPosition;
      } else {
        return { x: 0, y: 0 };
      }
    },
    routes: [
      {
        path: "/",
        component: () => import("~/layouts/default"),
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
                path: "image",
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
            name: "bangumi-show",
            component: () => import("~/views/bangumi/show")
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
            name: "user-show",
            component: () => import("~/views/user/show")
          },
          {
            path: "me/setting",
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
            path: "role/:id(\\d+)",
            name: "role-show",
            component: () => import("~/views/role/show")
          },
          {
            path: "pins/:id(\\d+)",
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
        path: "/campaign",
        component: () => import("~/layouts/empty"),
        children: [
          {
            path: "canvas",
            component: () => import("~/views/campaign/canvas")
          }
        ]
      }
    ]
  });
}
