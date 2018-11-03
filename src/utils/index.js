import Vue from "vue";
import Alias from "~/assets/js/alias";
import Utils from "~/assets/js/utils";
import NoSSR from "~/assets/js/nossr";
import Time from "~/assets/js/timeago";
import MoreBtn from "~/components/common/MoreBtn";
import Drawer from "~/components/common/Drawer";
import CollapseTransition from "element-ui/lib/transitions/collapse-transition";
import ImageLazyLoad from "~/components/common/ImageLazyLoad";
import resizeImage from "~/assets/js/resizeImage";
import { Upload, Form, FormItem, Input, Button } from "element-ui";

Vue.use(Upload);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);
Vue.use(ImageLazyLoad, {});
Vue.component(CollapseTransition.name, CollapseTransition);
Vue.component(NoSSR.name, NoSSR);
Vue.component(Time.name, Time);
Vue.component(MoreBtn.name, MoreBtn);
Vue.component(Drawer.name, Drawer);

Vue.use({
  install(Vue) {
    Vue.prototype.$channel = new Vue();

    Vue.prototype.$alias = Alias;

    Vue.prototype.$utils = Utils;

    Vue.prototype.$resize = resizeImage;
  }
});
