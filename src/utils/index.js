import Vue from "vue";
import env from "env";
import Alias from "~/assets/js/alias";
import Utils from "~/assets/js/utils";
import NoSSR from "~/assets/js/nossr";
import Time from "~/assets/js/timeago";
import MoreBtn from "~/components/common/MoreBtn";
import Drawer from "~/components/common/Drawer";
import Radio from "~/components/common/Radio";
import BangumiPanel from "~/components/panel/BangumiPanel";
import Field from "~/components/common/Field";
import CollapseTransition from "element-ui/lib/transitions/collapse-transition";
import VCharts from "v-charts";
import ImageLazyLoad from "~/components/common/ImageLazyLoad";
import ImageUploader from "~/components/common/ImageUploader";
import UploadTokenMixin from "~/mixins/uptoken";
import resizeImage from "~/assets/js/resizeImage";

import { Swipe, SwipeItem, Picker, Switch, Actionsheet, Badge } from "mint-ui";

import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Upload,
  Form,
  FormItem,
  Input,
  Button,
  Rate
} from "element-ui";

Vue.mixin(UploadTokenMixin);
Vue.use(VCharts);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Upload);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);
Vue.use(Rate);
Vue.use(ImageLazyLoad, {});
Vue.component(ImageUploader.name, ImageUploader);
Vue.component(CollapseTransition.name, CollapseTransition);
Vue.component(Field.name, Field);
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
Vue.component(Picker.name, Picker);
Vue.component(NoSSR.name, NoSSR);
Vue.component(Time.name, Time);
Vue.component(MoreBtn.name, MoreBtn);
Vue.component(Drawer.name, Drawer);
Vue.component(Radio.name, Radio);
Vue.component(BangumiPanel.name, BangumiPanel);
Vue.component(Switch.name, Switch);
Vue.component(Actionsheet.name, Actionsheet);
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
