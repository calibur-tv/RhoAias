import Vue from "vue";
import Raven from "raven-js";
import RavenVue from "raven-js/plugins/vue";

export default class {
  constructor({ url, version, env }) {
    this.url = url;
    this.version = version;
    this.env = env;
  }

  init() {
    try {
      Raven.config(this.url, {
        release: this.version,
        environment: this.env,
        ignoreUrls: [/^file:\/\//],
        shouldSendCallback(data) {
          let shouldSend = true;
          try {
            const exception = data.exception.values[0];
            shouldSend = exception.stacktrace.frames.length > 1;
          } catch (e) {
            shouldSend = false;
          }
          return shouldSend;
        },
        ignoreErrors: [
          "Failed to execute 'getComputedStyle' on 'Window': parameter 1 is not of type 'Element'.",
          "Failed to read the 'localStorage' property from 'Window': Access is denied for this document.",
          "Unexpected token", // https://stackoverflow.com/questions/29763557/syntaxerror-unexpected-token-o-at-object-parse-native-angularjs
          "Blocked a frame",
          "uv'",
          "网络错误",
          "网络请求超时",
          "is not an object (evaluating", // https://github.com/facebook/react-native/issues/17348
          "Unexpected end of input", // https://stackoverflow.com/questions/29259395/syntaxerror-unexpected-end-of-input-at-object-parse-native-npm-request
          "Java exception was raised during method invocation",
          /Loading chunk (\d+) failed./, // https://github.com/webpack/webpack/issues/5964
          "Can't find variable: ",
          "NS_ERROR_UNKNOWN_PROTOCOL",
          /(Unknown|No) error/, // Chrome Mobile 37.0.0
          /Cannot read property '(\w|\W)+' of (undefined|null)/, // https://github.com/vuejs/vue/issues/8399
          /is not a function(\w|\W)+/,
          /(ture|mbrowser|local_kingkr_obj|Java object)/,
          "Maximum call stack size exceeded",
          /(readonly|redefine) property/,
          "Failed to execute 'appendChild' on 'Node'",
          "value.hasOwnProperty is not a function",
          /([native code]|<anonymous>)/
        ]
      })
        .addPlugin(RavenVue, Vue)
        .install();
    } catch (e) {
      Raven.captureException(e);
    }
  }

  report() {
    try {
      const dom = undefined;
      const rect = dom.getBoundingClientRect();
      return (
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        (rect.left < window.innerWidth && rect.right > 0)
      );
    } catch (e) {
      e.message = "---------- test sentry report ----------";
      Raven.captureException(e);
    }
  }
}
