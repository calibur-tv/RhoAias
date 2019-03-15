import Vue from 'vue'
import NotSSR from '~/assets/js/notssr'
import Time from '~/assets/js/timeago'
import Drawer from '~/components/common/Drawer'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
import ImageLazyLoad from '~/components/common/ImageLazyLoad'
import LazyComponent from '~/components/common/LazyComponent'
import { Upload, Form, FormItem, Input, Button } from 'element-ui'
import VueClipboards from 'vue-clipboards'

Vue.use(VueClipboards)
Vue.use(Upload)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(ImageLazyLoad, {})
Vue.component(LazyComponent.name, LazyComponent)
Vue.component(CollapseTransition.name, CollapseTransition)
Vue.component(NotSSR.name, NotSSR)
Vue.component(Time.name, Time)
Vue.component(Drawer.name, Drawer)
