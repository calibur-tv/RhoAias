exports.ids=[15],exports.modules={173:function(t,e){},174:function(t,e,n){t.exports=n.p+"img/aa8b45a.png"},175:function(t,e,n){"use strict";var r=n(4),o={name:"FlowState",props:{auto:{type:Boolean,default:!1},loading:{type:Boolean,default:!1},noMore:{type:Boolean,default:!1},nothing:{type:Boolean,default:!1},error:{type:Boolean,default:!1},fetch:{type:Function,required:!0},displayNoMore:{type:Boolean,default:!0}},mounted(){this.auto&&this.onScroll()},methods:{getTarget(){let t=this.$el;for(;"HTML"!==t.tagName&&"BOYD"!==t.tagName&&1===t.nodeType;){const e=window.getComputedStyle(t).overflowY;if("scroll"===e||"auto"===e)return t;t=t.parentNode}return document},onScroll(){if(this.error)return;r.a.checkInView(this.$el)&&this.fetch();const t=r.a.on(this.getTarget(),["scroll"],this.$utils.throttle(()=>{this.error||(!this.noMore&&this.auto?r.a.checkInView(this.$el)&&this.fetch():r.a.off(t))},200))}}},c=n(1);var component=Object(c.a)(o,function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"flow-state-wrap"},[t.error?t._ssrNode("<div>","</div>",[t._t("error",[r("div",{staticClass:"state-error"},[r("span",[t._v("出错了，点击重试")])])])],2):t.nothing?t._ssrNode("<div>","</div>",[t._t("nothing",[r("div",{staticClass:"state-nothing"},[r("img",{attrs:{src:n(174),alt:"no-content"}}),t._v(" "),r("span",[t._v("这里什么都没有")])])])],2):t.noMore?t._ssrNode("<div>","</div>",[t._t("no-more",[t.displayNoMore?r("div",{staticClass:"state-no-more"},[r("span",[t._v("没有更多了")])]):t._e()])],2):t.loading?t._ssrNode("<div>","</div>",[t._t("loading",[r("div",{staticClass:"state-loading"},[r("i"),t._v(" "),r("span",[t._v("加载中…")])])])],2):t.auto?t._ssrNode('<div class="state-shim"></div>'):t._ssrNode("<button>","</button>",[t._t("load-btn",[r("div",{staticClass:"state-fetch-btn-text"},[r("span",[t._v("点击加载更多")])])])],2)])},[],!1,function(t){var e=n(176);e.__inject__&&e.__inject__(t)},null,"16540fb2");e.a=component.exports},176:function(t,e,n){"use strict";n.r(e);var r=n(173),o=n.n(r);for(var c in r)"default"!==c&&function(t){n.d(e,t,function(){return r[t]})}(c);e.default=o.a},177:function(t,e,n){"use strict";var r=n(175),o={props:{func:{required:!0,type:String},type:{required:!0,type:String},id:{type:[Number,String],default:""},sort:{type:String,default:""},auto:{type:Boolean,default:!0},count:{type:[String,Number],default:12},changing:{type:String,default:"id"},displayNoMore:{type:Boolean,default:!0}}},c={name:"FlowList",components:{FlowState:r.a},mixins:[o],computed:{source(){return this.$store.getters["flow/getFlow"](this.func,this.sort,this.id)}},methods:{loadMore(){this.$store.dispatch("flow/loadMore",{type:this.type,sort:this.sort,func:this.func,id:this.id,count:this.count,changing:this.changing,_extra:this.extra})}}},l=n(1),component=Object(l.a)(c,function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.source?n("div",[t._t("header",null,{source:t.source}),t._ssrNode(" "),t._t("default",null,{flow:t.source.list}),t._ssrNode(" "),n("FlowState",{attrs:{auto:t.auto,loading:t.source.loading,"no-more":t.source.noMore,nothing:t.source.nothing,error:t.source.error,"display-no-more":t.displayNoMore,fetch:t.loadMore}},[t._t("error",null,{slot:"error"}),t._v(" "),t._t("nothing",null,{slot:"nothing"}),t._v(" "),t._t("no-more",null,{slot:"no-more"}),t._v(" "),t._t("loading",null,{slot:"loading"}),t._v(" "),t._t("load-btn",null,{slot:"load-btn"})],2)],2):t._e()},[],!1,null,null,"0bee53e6");e.a=component.exports},179:function(t,e){},180:function(t,e){},181:function(t,e){},182:function(t,e){},193:function(t,e){},195:function(t,e,n){"use strict";n.r(e);var r=n(179),o=n.n(r);for(var c in r)"default"!==c&&function(t){n.d(e,t,function(){return r[t]})}(c);e.default=o.a},196:function(t,e,n){"use strict";n.r(e);var r=n(180),o=n.n(r);for(var c in r)"default"!==c&&function(t){n.d(e,t,function(){return r[t]})}(c);e.default=o.a},197:function(t,e,n){"use strict";n.r(e);var r=n(181),o=n.n(r);for(var c in r)"default"!==c&&function(t){n.d(e,t,function(){return r[t]})}(c);e.default=o.a},202:function(t,e,n){"use strict";var r={name:"UserAvatar",props:{user:{type:Object,required:!0},size:{type:Number,default:40}},methods:{toUser(){this.$router.push(this.$alias.user(this.user.zone))}}},o=n(1);var c=Object(o.a)(r,function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"user-avatar",style:{width:t.$px2vw(t.size),height:t.$px2vw(t.size)},on:{click:function(e){return e.stopPropagation(),t.toUser(e)}}},[t._ssrNode("<img"+t._ssrAttr("src",t.$resize(t.user.avatar,{width:2*t.size}))+">")])},[],!1,function(t){var e=n(195);e.__inject__&&e.__inject__(t)},null,"16ffe9a8").exports,l={name:"UserNickname",props:{user:{type:Object,required:!0},isMaster:{type:Boolean,default:!1}},methods:{toUser(){this.$router.push(this.$alias.user(this.user.zone))}}};var d={name:"FlowHeaderUser",components:{UserAvatar:c,UserNickname:Object(o.a)(l,function(){var t=this.$createElement;return(this._self._c||t)("div",{staticClass:"user-nickname"},[this._ssrNode('<div class="nickname"><p class="oneline">'+this._ssrEscape(this._s(this.user.nickname))+"</p></div> "+(this.isMaster?'<span class="badge master-badge"><span>楼主</span></span>':"\x3c!----\x3e"))])},[],!1,function(t){var e=n(196);e.__inject__&&e.__inject__(t)},null,"0ad68c7d").exports},props:{user:{type:Object,required:!0},time:{type:String,required:!0}}};var _=Object(o.a)(d,function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"user-panel"},[n("UserAvatar",{attrs:{user:t.user}}),t._ssrNode(" "),t._ssrNode('<div class="slot">',"</div>",[t._t("default")],2),t._ssrNode(" "),t._ssrNode('<div class="user-info">',"</div>",[n("UserNickname",{attrs:{user:t.user}}),t._ssrNode(" "),n("VTime",{model:{value:t.time,callback:function(e){t.time=e},expression:"time"}})],2)],2)},[],!1,function(t){var e=n(197);e.__inject__&&e.__inject__(t)},null,"7d79de9c");e.a=_.exports},203:function(t,e,n){"use strict";var r={name:"FlowImages",props:{images:{type:Array,required:!0}},data:()=>({}),computed:{},watch:{},created(){},mounted(){},methods:{}},o=n(1);var component=Object(o.a)(r,function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.images.length?n("div",{staticClass:"flow-images"},[t.images.length>=3?t._ssrNode('<div class="three-images">',"</div>",[t._ssrNode('<div class="item">',"</div>",[n("v-img",{attrs:{src:t.images[0].url,width:"100%",height:"120"}})],1),t._ssrNode(' <div class="h-shim"></div> '),t._ssrNode('<div class="wrap">',"</div>",[n("v-img",{attrs:{src:t.images[1].url,width:"100%",height:"58"}}),t._ssrNode(' <div class="w-shim"></div> '),n("v-img",{attrs:{src:t.images[2].url,width:"100%",height:"58"}})],2)],2):2===t.images.length?t._ssrNode('<div class="two-images">',"</div>",[t._ssrNode('<div class="item">',"</div>",[n("v-img",{attrs:{src:t.images[0].url,width:"100%",height:"120"}})],1),t._ssrNode(' <div class="h-shim"></div> '),t._ssrNode('<div class="item">',"</div>",[n("v-img",{attrs:{src:t.images[1].url,width:"100%",height:"120"}})],1)],2):n("v-img",{attrs:{src:t.images[0].url,width:"100%",height:"120"}})],1):t._e()},[],!1,function(t){var e=n(204);e.__inject__&&e.__inject__(t)},null,"6f6b1127");e.a=component.exports},204:function(t,e,n){"use strict";n.r(e);var r=n(182),o=n.n(r);for(var c in r)"default"!==c&&function(t){n.d(e,t,function(){return r[t]})}(c);e.default=o.a},219:function(t,e,n){"use strict";n.r(e);var r=n(193),o=n.n(r);for(var c in r)"default"!==c&&function(t){n.d(e,t,function(){return r[t]})}(c);e.default=o.a},231:function(t,e,n){"use strict";var r=n(202),o=n(203),c={name:"PostFlowItem",components:{FlowHeaderUser:r.a,FlowImages:o.a},props:{item:{required:!0,type:Object},bangumiId:{type:[Number,String],default:0},userZone:{type:String,default:""}},methods:{imageFilter:t=>t.slice(0,3)}},l=n(1);var component=Object(l.a)(c,function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("li",{staticClass:"post-flow-item"},[n("router-link",{attrs:{to:t.$alias.post(t.item.id),tag:"div"}},[n("div",{staticClass:"header"},[t.userZone?[n("router-link",{staticClass:"bangumi-avatar",attrs:{to:t.$alias.bangumi(t.item.bangumi.id)}},[n("v-img",{attrs:{src:t.item.bangumi.avatar,width:"35",height:"35"}})],1),t._v(" "),n("div",{staticClass:"info"},[n("router-link",{staticClass:"name oneline",attrs:{to:t.$alias.bangumi(t.item.bangumi.id)},domProps:{textContent:t._s(t.item.bangumi.name)}}),t._v(" "),n("v-time",{model:{value:t.item.created_at,callback:function(e){t.$set(t.item,"created_at",e)},expression:"item.created_at"}})],1)]:[n("FlowHeaderUser",{attrs:{user:t.item.user,time:t.item.created_at}})]],2),t._v(" "),n("div",{staticClass:"body"},[n("div",{staticClass:"title"},[t.item.top_at&&t.bangumiId?n("div",{staticClass:"top_badge"},[t._v("\n          置顶\n        ")]):t._e(),t._v(" "),t.item.is_nice?n("div",{staticClass:"nice_badge"},[t._v("\n          精\n        ")]):t._e(),t._v(" "),t.item.is_creator?n("div",{staticClass:"creator_badge"},[t._v("\n          原创\n        ")]):t._e(),t._v(" "),n("p",{staticClass:"oneline",domProps:{textContent:t._s(t.item.title)}})]),t._v(" "),n("p",{staticClass:"content",domProps:{textContent:t._s(t.item.desc)}}),t._v(" "),n("FlowImages",{attrs:{images:t.item.images}}),t._v(" "),n("div",{staticClass:"tags"},[t.item.bangumi&&!t.bangumiId?n("router-link",{attrs:{to:t.$alias.bangumi(t.item.bangumi.id)}},[n("i",{staticClass:"iconfont icon-tag"}),t._v(" "),n("span",{domProps:{textContent:t._s(t.item.bangumi.name)}})]):t._e(),t._v(" "),t.item.idol?n("router-link",{attrs:{to:t.$alias.cartoonRole(t.item.idol.id)}},[n("i",{staticClass:"iconfont icon-tag"}),t._v(" "),n("span",{domProps:{textContent:t._s(t.item.idol.name)}})]):t._e(),t._v(" "),t.item.tags.length?t._l(t.item.tags,function(e){return n("span",{key:e.id,staticClass:"tag",domProps:{textContent:t._s(e.name)}})}):t._e()],2)],1),t._v(" "),n("div",{staticClass:"footer"},[t.item.is_creator?n("div",[n("i",{staticClass:"iconfont icon-fantuan"}),t._v(" "),n("span",[t._v(t._s(t.$utils.shortenNumber(t.item.reward_count)))])]):n("div",[n("i",{staticClass:"iconfont icon-like"}),t._v(" "),n("span",[t._v(t._s(t.$utils.shortenNumber(t.item.like_count)))])]),t._v(" "),n("div",[n("i",{staticClass:"iconfont icon-mark"}),t._v(" "),n("span",[t._v(t._s(t.$utils.shortenNumber(t.item.mark_count)))])]),t._v(" "),n("div",[n("i",{staticClass:"iconfont icon-talk"}),t._v(" "),n("span",[t._v(t._s(t.$utils.shortenNumber(t.item.comment_count)))])])])]),t._ssrNode(' <div class="hr"></div>')],2)},[],!1,function(t){var e=n(219);e.__inject__&&e.__inject__(t)},null,"9b8d58e8");e.a=component.exports},480:function(t,e,n){"use strict";n.r(e);var r=n(177),o=n(231),c=n(38),l={name:"BangumiPostFlow",components:{FlowList:r.a,PostFlowItem:o.a},props:{id:{required:!0,type:String}},data:()=>({topic:[]}),asyncData:async({app:t,params:e})=>({topic:await Object(c.h)(t,{id:e.id})}),async fetch({store:t,params:e}){await t.dispatch("flow/initData",{id:e.id,func:"getBangumiPost",type:"seenIds",sort:"active"})},methods:{computeFlow(t){return this.topic.concat(t)}}},d=n(1),component=Object(d.a)(l,function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"bangumi-post-flow"}},[n("FlowList",{attrs:{id:t.id,func:"getBangumiPost",type:"seenIds",sort:"active"},scopedSlots:t._u([{key:"default",fn:function(e){var r=e.flow;return n("ul",{},t._l(t.computeFlow(r),function(e){return n("PostFlowItem",{key:e.id,attrs:{"bangumi-id":t.id,item:e}})}),1)}}])})],1)},[],!1,null,null,"5ddb5ba2");e.default=component.exports}};
//# sourceMappingURL=post.chunk.75604f5e.js.map