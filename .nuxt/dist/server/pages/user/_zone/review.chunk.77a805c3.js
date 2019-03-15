exports.ids=[56],exports.modules={173:function(t,e){},174:function(t,e,r){t.exports=r.p+"img/aa8b45a.png"},175:function(t,e,r){"use strict";var o=r(4),n={name:"FlowState",props:{auto:{type:Boolean,default:!1},loading:{type:Boolean,default:!1},noMore:{type:Boolean,default:!1},nothing:{type:Boolean,default:!1},error:{type:Boolean,default:!1},fetch:{type:Function,required:!0},displayNoMore:{type:Boolean,default:!0}},mounted(){this.auto&&this.onScroll()},methods:{getTarget(){let t=this.$el;for(;"HTML"!==t.tagName&&"BOYD"!==t.tagName&&1===t.nodeType;){const e=window.getComputedStyle(t).overflowY;if("scroll"===e||"auto"===e)return t;t=t.parentNode}return document},onScroll(){if(this.error)return;o.a.checkInView(this.$el)&&this.fetch();const t=o.a.on(this.getTarget(),["scroll"],this.$utils.throttle(()=>{this.error||(!this.noMore&&this.auto?o.a.checkInView(this.$el)&&this.fetch():o.a.off(t))},200))}}},l=r(1);var component=Object(l.a)(n,function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"flow-state-wrap"},[t.error?t._ssrNode("<div>","</div>",[t._t("error",[o("div",{staticClass:"state-error"},[o("span",[t._v("出错了，点击重试")])])])],2):t.nothing?t._ssrNode("<div>","</div>",[t._t("nothing",[o("div",{staticClass:"state-nothing"},[o("img",{attrs:{src:r(174),alt:"no-content"}}),t._v(" "),o("span",[t._v("这里什么都没有")])])])],2):t.noMore?t._ssrNode("<div>","</div>",[t._t("no-more",[t.displayNoMore?o("div",{staticClass:"state-no-more"},[o("span",[t._v("没有更多了")])]):t._e()])],2):t.loading?t._ssrNode("<div>","</div>",[t._t("loading",[o("div",{staticClass:"state-loading"},[o("i"),t._v(" "),o("span",[t._v("加载中…")])])])],2):t.auto?t._ssrNode('<div class="state-shim"></div>'):t._ssrNode("<button>","</button>",[t._t("load-btn",[o("div",{staticClass:"state-fetch-btn-text"},[o("span",[t._v("点击加载更多")])])])],2)])},[],!1,function(t){var e=r(176);e.__inject__&&e.__inject__(t)},null,"16540fb2");e.a=component.exports},176:function(t,e,r){"use strict";r.r(e);var o=r(173),n=r.n(o);for(var l in o)"default"!==l&&function(t){r.d(e,t,function(){return o[t]})}(l);e.default=n.a},177:function(t,e,r){"use strict";var o=r(175),n={props:{func:{required:!0,type:String},type:{required:!0,type:String},id:{type:[Number,String],default:""},sort:{type:String,default:""},auto:{type:Boolean,default:!0},count:{type:[String,Number],default:12},changing:{type:String,default:"id"},displayNoMore:{type:Boolean,default:!0}}},l={name:"FlowList",components:{FlowState:o.a},mixins:[n],computed:{source(){return this.$store.getters["flow/getFlow"](this.func,this.sort,this.id)}},methods:{loadMore(){this.$store.dispatch("flow/loadMore",{type:this.type,sort:this.sort,func:this.func,id:this.id,count:this.count,changing:this.changing,_extra:this.extra})}}},d=r(1),component=Object(d.a)(l,function(){var t=this,e=t.$createElement,r=t._self._c||e;return t.source?r("div",[t._t("header",null,{source:t.source}),t._ssrNode(" "),t._t("default",null,{flow:t.source.list}),t._ssrNode(" "),r("FlowState",{attrs:{auto:t.auto,loading:t.source.loading,"no-more":t.source.noMore,nothing:t.source.nothing,error:t.source.error,"display-no-more":t.displayNoMore,fetch:t.loadMore}},[t._t("error",null,{slot:"error"}),t._v(" "),t._t("nothing",null,{slot:"nothing"}),t._v(" "),t._t("no-more",null,{slot:"no-more"}),t._v(" "),t._t("loading",null,{slot:"loading"}),t._v(" "),t._t("load-btn",null,{slot:"load-btn"})],2)],2):t._e()},[],!1,null,null,"0bee53e6");e.a=component.exports},182:function(t,e){},203:function(t,e,r){"use strict";var o={name:"FlowImages",props:{images:{type:Array,required:!0}},data:()=>({}),computed:{},watch:{},created(){},mounted(){},methods:{}},n=r(1);var component=Object(n.a)(o,function(){var t=this,e=t.$createElement,r=t._self._c||e;return t.images.length?r("div",{staticClass:"flow-images"},[t.images.length>=3?t._ssrNode('<div class="three-images">',"</div>",[t._ssrNode('<div class="item">',"</div>",[r("v-img",{attrs:{src:t.images[0].url,width:"100%",height:"120"}})],1),t._ssrNode(' <div class="h-shim"></div> '),t._ssrNode('<div class="wrap">',"</div>",[r("v-img",{attrs:{src:t.images[1].url,width:"100%",height:"58"}}),t._ssrNode(' <div class="w-shim"></div> '),r("v-img",{attrs:{src:t.images[2].url,width:"100%",height:"58"}})],2)],2):2===t.images.length?t._ssrNode('<div class="two-images">',"</div>",[t._ssrNode('<div class="item">',"</div>",[r("v-img",{attrs:{src:t.images[0].url,width:"100%",height:"120"}})],1),t._ssrNode(' <div class="h-shim"></div> '),t._ssrNode('<div class="item">',"</div>",[r("v-img",{attrs:{src:t.images[1].url,width:"100%",height:"120"}})],1)],2):r("v-img",{attrs:{src:t.images[0].url,width:"100%",height:"120"}})],1):t._e()},[],!1,function(t){var e=r(204);e.__inject__&&e.__inject__(t)},null,"6f6b1127");e.a=component.exports},204:function(t,e,r){"use strict";r.r(e);var o=r(182),n=r.n(o);for(var l in o)"default"!==l&&function(t){r.d(e,t,function(){return o[t]})}(l);e.default=n.a},208:function(t,e){},245:function(t,e,r){"use strict";r.r(e);var o=r(208),n=r.n(o);for(var l in o)"default"!==l&&function(t){r.d(e,t,function(){return o[t]})}(l);e.default=n.a},259:function(t,e,r){"use strict";r(89),r(2);var o=r(46),n=r.n(o),l={name:"ScoreFlowItem",components:{FlowImages:r(203).a,"el-rate":n.a},props:{item:{required:!0,type:Object},bangumiId:{required:!0,type:[String,Number]},userZone:{required:!0,type:String}},data:()=>({zero:0}),computed:{pageName(){return this.$route.name},starCount(){return this.item.total/2}},methods:{linkStart(){this.$router.push(this.$alias.score(this.item.id))}}},d=r(1);var component=Object(d.a)(l,function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("li",{staticClass:"score-flow-item"},[t._ssrNode("<div>","</div>",[t.item.bangumi&&t.item.user?t._ssrNode('<div class="header trending-header">',"</div>",[r("nuxt-link",{staticClass:"user-avatar",attrs:{to:t.$alias.user(t.item.user.zone)}},[r("v-img",{attrs:{src:t.item.user.avatar,avatar:!0,width:"35",height:"35"}})],1),t._ssrNode(" "),t._ssrNode('<div class="header-content">',"</div>",[t._ssrNode('<div class="about">',"</div>",[t.starCount?r("el-rate",{attrs:{disabled:""},model:{value:t.starCount,callback:function(e){t.starCount=e},expression:"starCount"}}):r("el-rate",{attrs:{disabled:""},model:{value:t.zero,callback:function(e){t.zero=e},expression:"zero"}}),t._ssrNode(" "),r("nuxt-link",{staticClass:"bangumi-name oneline",attrs:{to:t.$alias.bangumi(t.item.bangumi.id)},domProps:{textContent:t._s(t.item.bangumi.name)}})],2),t._ssrNode(" "),t._ssrNode('<div class="meta">',"</div>",[r("nuxt-link",{staticClass:"author",attrs:{to:t.$alias.user(t.item.user.zone)},domProps:{textContent:t._s(t.item.user.nickname)}}),t._ssrNode("\n           · \n          "),r("v-time",{staticClass:"created-at",model:{value:t.item.created_at,callback:function(e){t.$set(t.item,"created_at",e)},expression:"item.created_at"}})],2)],2)],2):t.item.bangumi?t.item.user?t._e():t._ssrNode('<div class="header user-header">',"</div>",[t.starCount?r("el-rate",{attrs:{disabled:""},model:{value:t.starCount,callback:function(e){t.starCount=e},expression:"starCount"}}):r("el-rate",{attrs:{disabled:""},model:{value:t.zero,callback:function(e){t.zero=e},expression:"zero"}}),t._ssrNode(" "),r("nuxt-link",{staticClass:"bangumi",attrs:{to:t.$alias.bangumi(t.item.bangumi.id)}},[r("div",{staticClass:"bangumi-avatar"},[r("v-img",{attrs:{src:t.item.bangumi.avatar,width:"23",height:"23"}})],1),t._v(" "),r("div",{staticClass:"nickname oneline",domProps:{textContent:t._s(t.item.bangumi.name)}})])],2):t._ssrNode('<div class="header bangumi-header">',"</div>",[t.starCount?r("el-rate",{attrs:{disabled:""},model:{value:t.starCount,callback:function(e){t.starCount=e},expression:"starCount"}}):r("el-rate",{attrs:{disabled:""},model:{value:t.zero,callback:function(e){t.zero=e},expression:"zero"}}),t._ssrNode(" "),r("nuxt-link",{staticClass:"user",attrs:{to:t.$alias.user(t.item.user.zone)}},[r("div",{staticClass:"user-avatar"},[r("v-img",{attrs:{src:t.item.user.avatar,avatar:!0,width:"35",height:"35"}})],1),t._v(" "),r("div",{staticClass:"nickname oneline",domProps:{textContent:t._s(t.item.user.nickname)}})])],2),t._ssrNode(" "),t._ssrNode('<div class="body">',"</div>",[t._ssrNode('<div class="title"><p class="oneline">'+t._ssrEscape(t._s(t.item.title))+"</p></div> "),r("FlowImages",{attrs:{images:t.item.images}}),t._ssrNode(' <div class="content">'+t._ssrEscape(t._s(t.item.intro))+"</div>")],2),t._ssrNode(' <div class="footer">'+(t.item.is_creator?'<div><i class="iconfont icon-fantuan"></i> <span>'+t._ssrEscape(t._s(t.$utils.shortenNumber(t.item.reward_count)))+"</span></div>":'<div><i class="iconfont icon-like"></i> <span>'+t._ssrEscape(t._s(t.$utils.shortenNumber(t.item.like_count)))+"</span></div>")+' <div><i class="iconfont icon-mark"></i> <span>'+t._ssrEscape(t._s(t.$utils.shortenNumber(t.item.mark_count)))+'</span></div> <div><i class="iconfont icon-talk"></i> <span>'+t._ssrEscape(t._s(t.$utils.shortenNumber(t.item.comment_count)))+"</span></div></div>")],2),t._ssrNode(' <div class="hr"></div>')],2)},[],!1,function(t){var e=r(245);e.__inject__&&e.__inject__(t)},null,"661be238");e.a=component.exports},516:function(t,e,r){"use strict";r.r(e);var o=r(177),n=r(259),l={name:"UserScore",components:{FlowList:o.a,ScoreFlowItem:n.a},props:{zone:{type:String,required:!0}},async asyncData({store:t,params:e}){await t.dispatch("flow/initData",{func:"getUserScore",type:"page",sort:"news",id:e.zone})}},d=r(1),component=Object(d.a)(l,function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("FlowList",{attrs:{id:t.zone,func:"getUserScore",type:"page",sort:"news"},scopedSlots:t._u([{key:"default",fn:function(e){var o=e.flow;return r("ul",{},t._l(o,function(e){return r("ScoreFlowItem",{key:e.id,attrs:{item:e,"user-zone":t.zone,"bangumi-id":""}})}),1)}}])})},[],!1,null,null,"141cfdac");e.default=component.exports}};
//# sourceMappingURL=review.chunk.77a805c3.js.map