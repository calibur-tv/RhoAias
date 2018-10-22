import Vue from "vue";
import env from "env";
import Alias from "~/assets/js/alias";
import Utils from "~/assets/js/utils";
import NoSSR from "~/assets/js/nossr";
import Time from "~/assets/js/timeago";
import MoreBtn from "~/components/common/MoreBtn";
import Drawer from "~/components/common/Drawer";
import BangumiPanel from "~/components/panel/BangumiPanel";
import CollapseTransition from "element-ui/lib/transitions/collapse-transition";
import ImageLazyLoad from "~/components/common/ImageLazyLoad";
import ImageUploader from "~/components/common/ImageUploader";
import resizeImage from "~/assets/js/resizeImage";
import VPopover from "~/components/common/Popover";
import { Picker, Switch, Badge } from "mint-ui";
import { Upload, Form, FormItem, Input, Button } from "element-ui";

Vue.use(Upload);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);
Vue.use(ImageLazyLoad, {});
Vue.component(VPopover.name, VPopover);
Vue.component(ImageUploader.name, ImageUploader);
Vue.component(CollapseTransition.name, CollapseTransition);
Vue.component(Picker.name, Picker);
Vue.component(NoSSR.name, NoSSR);
Vue.component(Time.name, Time);
Vue.component(MoreBtn.name, MoreBtn);
Vue.component(Drawer.name, Drawer);
Vue.component(BangumiPanel.name, BangumiPanel);
Vue.component(Switch.name, Switch);
Vue.component(Badge.name, Badge);

Vue.use({
  install(Vue, options) {
    Vue.prototype.$cdn = env.cdn;

    Vue.prototype.$channel = new Vue();

    Vue.prototype.$alias = Alias;

    Vue.prototype.$utils = Utils;

    Vue.prototype.$siteQR = `${env.cdn.image}owner/site-qr.png`;

    Vue.prototype.$resize = resizeImage;
  }
});

Vue.mixin({
  methods: {
    $computeImageAspect(image) {
      const width = image.width;
      const height = image.height;

      if (!width || !height) {
        return 0;
      }

      return height / width;
    }
  }
});
