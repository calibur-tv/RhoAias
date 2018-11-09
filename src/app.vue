<style lang="scss" module>
.share-img {
  position: fixed;
  left: 100%;
  top: -100%;
}
</style>

<template>
  <div id="app">
    <router-view/>
    <img
      :class="$style.shareImg"
      src="https://image.calibur.tv/owner/logo/max.png?imageMogr2/auto-orient/strip|imageView2/1/w/200/h/200"
    >
    <sign-drawer/>
  </div>
</template>

<script>
import { cdn, script, env, iPhoneXViewport } from "env";
import SignDrawer from "~/components/common/Sign";

export default {
  name: "Entry",
  head() {
    const state = this.$store.state;
    const ua = state.ua;

    return {
      title: "天下漫友是一家",
      titleTemplate: titleChunk => {
        return titleChunk || "calibur.tv";
      },
      htmlAttrs: {
        lang: "zh-CN"
      },
      bodyAttrs: {
        id: "calibur-tv"
      },
      meta: [
        { charset: "utf-8" },
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        },
        { "http-equiv": "X-UA-Compatible", content: "IE=edge" },
        { name: "renderer", content: "webkit" },
        {
          hid: "description",
          name: "description",
          content: "calibur.tv，动漫爱好者的聚集地"
        },
        {
          rel: "search",
          type: "application/opensearchdescription+xml",
          title: "calibur",
          href: `${cdn.static}/owner/h5/search.xml`
        },
        {
          hid: "keywords",
          name: "keywords",
          content:
            "calibur，咖喱棒, 动漫，ACG，二次元，视频，番剧，动画，新番，神作, 排行榜, 贴吧, 盖楼, 应援, 帖子, 在线"
        }
      ],
      link: [
        {
          rel: "shortcut icon",
          type: "image/x-icon",
          href: `${cdn.static}/favicon.ico`
        }
      ],
      script: [
        env !== "development"
          ? {
              innerHTML: script.baiduStat,
              type: "text/javascript",
              async: true
            }
          : "",
        env !== "development"
          ? {
              innerHTML: script.baiduPush,
              type: "text/javascript",
              async: true
            }
          : "",
        env !== "production"
          ? {
              src:
                "https://res.wx.qq.com/mmbizwap/zh_CN/htmledition/js/vconsole/3.0.0/vconsole.min.js",
              type: "text/javascript"
            }
          : "",
        ua.ios ? { innerHTML: iPhoneXViewport, type: "text/javascript" } : "",
        ua.qq
          ? {
              src: "//qzonestyle.gtimg.cn/qzone/qzact/common/share/share.js",
              type: "text/javascript"
            }
          : "",
        ua.wechat
          ? {
              src: "//res.wx.qq.com/open/js/jweixin-1.0.0.js",
              type: "text/javascript"
            }
          : ""
      ].filter(_ => _),
      __dangerouslyDisableSanitizers: "script"
    };
  },
  components: {
    SignDrawer
  },
  created() {
    if (this.$isServer) {
      return;
    }
    M.vueHub = this.$channel;
  },
  mounted() {
    if (this.$store.state.login) {
      this.$store.dispatch("getNotification", this);
      this.$cookie.set("JWT-TOKEN", this.$store.state.user.token);
    }
    this.$store.dispatch("bangumi/getAllBangumi");
  }
};
</script>
