import Vue from "vue";
import Backdrop from "~/assets/js/Backdrop";
import captcha from "~/assets/js/captcha";
import Cookies from "js-cookie";
import Toast from "~/assets/js/Toast";

import { MessageBox } from "mint-ui";

Vue.use({
  install(Vue, options) {
    Vue.prototype.$cookie = Cookies;

    Vue.prototype.$channel = new Vue();

    Vue.prototype.$backdrop = new Backdrop();

    Vue.prototype.$toast = new Toast();

    Vue.prototype.$captcha = captcha;

    Vue.prototype.$alert = MessageBox.alert;

    Vue.prototype.$confirm = MessageBox.confirm;

    Vue.prototype.$prompt = MessageBox.prompt;
  }
});
