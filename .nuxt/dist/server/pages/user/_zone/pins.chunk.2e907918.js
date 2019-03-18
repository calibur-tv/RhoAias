exports.ids=[52],exports.modules={171:function(t,e){},172:function(t,e,n){t.exports=n.p+"img/aa8b45a.png"},173:function(t,e,n){"use strict";var o=n(4),r={name:"FlowState",props:{auto:{type:Boolean,default:!1},loading:{type:Boolean,default:!1},noMore:{type:Boolean,default:!1},nothing:{type:Boolean,default:!1},error:{type:Boolean,default:!1},fetch:{type:Function,required:!0},displayNoMore:{type:Boolean,default:!0}},mounted(){this.auto&&this.onScroll()},methods:{getTarget(){let t=this.$el;for(;"HTML"!==t.tagName&&"BOYD"!==t.tagName&&1===t.nodeType;){const e=window.getComputedStyle(t).overflowY;if("scroll"===e||"auto"===e)return t;t=t.parentNode}return document},onScroll(){if(this.error)return;o.a.checkInView(this.$el)&&this.fetch();const t=o.a.on(this.getTarget(),["scroll"],this.$utils.throttle(()=>{this.error||(!this.noMore&&this.auto?o.a.checkInView(this.$el)&&this.fetch():o.a.off(t))},200))}}},l=n(1);var component=Object(l.a)(r,function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"flow-state-wrap"},[t.error?t._ssrNode("<div>","</div>",[t._t("error",[o("div",{staticClass:"state-error"},[o("span",[t._v("出错了，点击重试")])])])],2):t.nothing?t._ssrNode("<div>","</div>",[t._t("nothing",[o("div",{staticClass:"state-nothing"},[o("img",{attrs:{src:n(172),alt:"no-content"}}),t._v(" "),o("span",[t._v("这里什么都没有")])])])],2):t.noMore?t._ssrNode("<div>","</div>",[t._t("no-more",[t.displayNoMore?o("div",{staticClass:"state-no-more"},[o("span",[t._v("没有更多了")])]):t._e()])],2):t.loading?t._ssrNode("<div>","</div>",[t._t("loading",[o("div",{staticClass:"state-loading"},[o("i"),t._v(" "),o("span",[t._v("加载中…")])])])],2):t.auto?t._ssrNode('<div class="state-shim"></div>'):t._ssrNode("<button>","</button>",[t._t("load-btn",[o("div",{staticClass:"state-fetch-btn-text"},[o("span",[t._v("点击加载更多")])])])],2)])},[],!1,function(t){var e=n(175);e.__inject__&&e.__inject__(t)},null,"16540fb2");e.a=component.exports},175:function(t,e,n){"use strict";n.r(e);var o=n(171),r=n.n(o);for(var l in o)"default"!==l&&function(t){n.d(e,t,function(){return o[t]})}(l);e.default=r.a},177:function(t,e,n){"use strict";var o=n(173),r={props:{func:{required:!0,type:String},type:{required:!0,type:String},id:{type:[Number,String],default:""},sort:{type:String,default:""},auto:{type:Boolean,default:!0},count:{type:[String,Number],default:12},changing:{type:String,default:"id"},displayNoMore:{type:Boolean,default:!0}}},l={name:"FlowList",components:{FlowState:o.a},mixins:[r],computed:{source(){return this.$store.getters["flow/getFlow"](this.func,this.sort,this.id)}},methods:{loadMore(){this.$store.dispatch("flow/loadMore",{type:this.type,sort:this.sort,func:this.func,id:this.id,count:this.count,changing:this.changing,_extra:this.extra})}}},c=n(1),component=Object(c.a)(l,function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.source?n("div",[t._t("header",null,{source:t.source}),t._ssrNode(" "),t._t("default",null,{flow:t.source.list}),t._ssrNode(" "),n("FlowState",{attrs:{auto:t.auto,loading:t.source.loading,"no-more":t.source.noMore,nothing:t.source.nothing,error:t.source.error,"display-no-more":t.displayNoMore,fetch:t.loadMore}},[t._t("error",null,{slot:"error"}),t._v(" "),t._t("nothing",null,{slot:"nothing"}),t._v(" "),t._t("no-more",null,{slot:"no-more"}),t._v(" "),t._t("loading",null,{slot:"loading"}),t._v(" "),t._t("load-btn",null,{slot:"load-btn"})],2)],2):t._e()},[],!1,null,null,"0bee53e6");e.a=component.exports},228:function(t,e){},229:function(t,e){},230:function(t,e){},274:function(t,e,n){"use strict";n.r(e);var o=n(228),r=n.n(o);for(var l in o)"default"!==l&&function(t){n.d(e,t,function(){return o[t]})}(l);e.default=r.a},275:function(t,e,n){"use strict";n.r(e);var o=n(229),r=n.n(o);for(var l in o)"default"!==l&&function(t){n.d(e,t,function(){return o[t]})}(l);e.default=r.a},276:function(t,e,n){"use strict";n.r(e);var o=n(230),r=n.n(o);for(var l in o)"default"!==l&&function(t){n.d(e,t,function(){return o[t]})}(l);e.default=r.a},287:function(t,e,n){"use strict";var o={name:"Waterfall",props:{lineCount:{required:!0,type:Number,validator:t=>t>=2},lineWidth:{required:!0,type:[Number,String]},marginRight:{type:Number,default:0,validator:t=>t>=0},marginBottom:{type:Number,default:0,validator:t=>t>=0},extraHeight:{type:Number,default:0,validator:t=>t>=0},maxHeight:{type:Number,default:0,validator:t=>t>=0},vwViewport:{type:Number,default:0,validator:t=>t>=0},lazyScale:{type:Number,default:1.3,validator:t=>t>=1}},data(){return{height:0,lineHeight:new Array(this.lineCount).fill(0),lastScrollTop:0,rectTop:"",windowHeight:this.$isServer?0:window.innerHeight,windowWidth:this.$isServer?0:window.innerWidth}},computed:{containerStyle(){return{height:`${this.height}px`}},imageWidth(){if(this.$isServer)return 0;const t={}.toString,e=this.lineWidth;if((e=>"[object Number]"===t.call(e))(e))return e;const n=(this.lineCount-1)*this.marginRight;return/vw$/.test(e)?+parseFloat((this.windowWidth-n)*e.replace("vw","")/100).toFixed(2):/%$/.test(e)?+parseFloat((this.$el.parentNode.offsetWidth-n)*e.replace("%","")/100).toFixed(2):+e.replace("px","")}},created(){this.$isServer||(this.$on("render",this.renderHandler),((t,e,n,o=!1)=>{t.addEventListener(e,n,o)})(window,"scroll",this.onScreenScroll))},beforeDestroy(){((t,e,n,o=!1)=>{t.removeEventListener(e,n,o)})(window,"scroll",this.onScreenScroll)},methods:{onScreenScroll:((t,e,n)=>{let o,r,l,c=null,d=0;n||(n={});const h=function(){d=!1===n.leading?0:Date.now(),c=null,l=t.apply(o,r),c||(o=r=null)};return function(){const m=Date.now();d||!1!==n.leading||(d=m);const f=e-(m-d);return o=this,r=arguments,f<=0||f>e?(c&&(clearTimeout(c),c=null),d=m,l=t.apply(o,r),c||(o=r=null)):c||!1===n.trailing||(c=setTimeout(h,f)),l}})(function(){this.lastScrollTop=document.documentElement.scrollTop||document.body.scrollTop,this.showOrHiddenItem()},200),renderHandler(t){const e=this.computeItemColIndex(),n=this.computedItemHeight(t),o=t.index>=this.lineCount,r=this.lineHeight[e];t.style={left:`${e*(this.imageWidth+this.marginRight)}px`,top:`${r}px`,width:`${this.imageWidth}px`,height:`${n}px`,marginTop:o?`${this.marginBottom}px`:""};const l=this.getContainerRectTop();t.top=l+r,t.bottom=l+r+n,this.checkInView(t),this.lineHeight[e]=+parseFloat(r+(o?n+this.marginBottom:n)).toFixed(2),this.computeContainerHeight()},computeItemColIndex(){const{lineHeight:t}=this;return t.indexOf(Math.min(...t))},computedItemHeight(t){const e=+parseFloat(t.height/t.width*this.imageWidth).toFixed(2)+this.extraHeight*this.windowWidth/this.vwViewport;return this.maxHeight&&e>this.maxHeight?this.maxHeight:e},computeContainerHeight(){this.height=Math.max(...this.lineHeight)},showOrHiddenItem(){this.$children.forEach(this.checkInView)},checkInView(t){const{lastScrollTop:e,windowHeight:n,lazyScale:o}=this;t.display=t.top<(e+n)*o&&t.bottom>e/o},getContainerRectTop(){if(""!==this.rectTop)return this.rectTop;const t=(t=>{let e=0;do{isNaN(t.offsetTop)||(e+=t.offsetTop)}while(t=t.offsetParent);return e})(this.$el);return this.rectTop=t,t}}},r=n(1);var l=Object(r.a)(o,function(){var t=this.$createElement;return(this._self._c||t)("div",{staticClass:"vue-waterfall-container",style:this.containerStyle},[this._t("default")],2)},[],!1,function(t){var e=n(274);e.__inject__&&e.__inject__(t)},null,"15543ac1").exports,c={name:"WaterfallSlot",props:{width:{type:[Number,String],required:!0},height:{type:[Number,String],required:!0},index:{type:[Number,String],required:!0},transition:{type:String,default:""}},data:()=>({top:0,bottom:0,display:!1,style:{}}),mounted(){this.notify()},methods:{notify(){this.$parent.$emit("render",this)}}};var d={name:"ImageWaterfallFlow",components:{Waterfall:l,WaterfallSlot:Object(r.a)(c,function(){var t=this.$createElement,e=this._self._c||t;return e("keep-alive",[e("transition",{attrs:{name:this.transition}},[this.display?e("div",{staticClass:"waterfall-slot",style:this.style},[this._t("default")],2):this._e()])],1)},[],!1,function(t){var e=n(275);e.__inject__&&e.__inject__(t)},null,"70811d5f").exports},props:{list:{required:!0,type:Array,default:()=>[]},bangumiId:{type:[Number,String],default:0},userZone:{type:String,default:""}},methods:{getRandomColor(){const t=["rgba(21,174,103,.5)","rgba(245,163,59,.5)","rgba(255,230,135,.5)","rgba(194,217,78,.5)","rgba(195,123,177,.5)","rgba(125,205,244,.5)"];return t[~~(Math.random()*t.length)]}}};var h=Object(r.a)(d,function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"image-waterfall-flow"}},[t._ssrNode('<div class="waterfall-wrap">',"</div>",[t.list.length?n("Waterfall",{attrs:{"line-count":2,"margin-right":10,"margin-bottom":10,"extra-height":106,"vw-viewport":375,"max-height":436,"line-width":"50%"}},t._l(t.list,function(e,o){return n("WaterfallSlot",{key:e.id,attrs:{index:o,width:e.source.width,height:e.source.height}},[n("div",{staticClass:"image-item"},[n("nuxt-link",{staticClass:"image-box",class:{"album-box":e.is_album},attrs:{to:t.$alias.image(e.id)}},[e.is_creator?n("i",{staticClass:"is-creator iconfont icon-huangguan"}):t._e(),t._v(" "),n("div",{staticClass:"image",style:{backgroundColor:""+t.getRandomColor(),backgroundImage:"url("+t.$resize(e.source.url,{width:400,mode:2})+")",paddingTop:e.source.height/e.source.width*100+"%"}}),t._v(" "),e.is_album?n("div",{staticClass:"is-album"},[n("i",{staticClass:"el-icon-picture-outline"}),t._v(" "),n("span",{staticClass:"image-count",domProps:{textContent:t._s(e.image_count)}})]):t._e()]),t._v(" "),n("div",{staticClass:"panel"},[n("div",{staticClass:"intro"},[n("p",{staticClass:"name oneline",domProps:{textContent:t._s(e.name)}}),t._v(" "),n("div",{staticClass:"social"},[e.is_creator?n("span",[n("i",{staticClass:"iconfont icon-fantuan"}),t._v(" "),n("span",[t._v(t._s(e.reward_count))])]):n("span",[n("i",{staticClass:"iconfont icon-like"}),t._v(" "),n("span",[t._v(t._s(e.like_count))])]),t._v(" "),n("span",[n("i",{staticClass:"iconfont icon-mark"}),t._v(" "),n("span",[t._v(t._s(e.mark_count))])]),t._v(" "),n("span",[n("i",{staticClass:"iconfont icon-talk"}),t._v(" "),n("span",[t._v(t._s(e.comment_count))])])])]),t._v(" "),n("div",{staticClass:"about"},[t.userZone?[n("nuxt-link",{staticClass:"bangumi-avatar",attrs:{to:t.$alias.bangumi(e.bangumi.id)}},[n("v-img",{attrs:{lazy:!1,src:e.bangumi.avatar,width:"60"}})],1),t._v(" "),n("div",{staticClass:"info"},[n("nuxt-link",{staticClass:"main-name oneline",attrs:{to:t.$alias.bangumi(e.bangumi.id)},domProps:{textContent:t._s(e.bangumi.name)}})],1)]:t.bangumiId?[n("nuxt-link",{staticClass:"user-avatar",attrs:{to:t.$alias.user(e.user.zone)}},[n("v-img",{attrs:{src:e.user.avatar,lazy:!1,width:"30",height:"30"}})],1),t._v(" "),n("nuxt-link",{staticClass:"main-name-user",attrs:{to:t.$alias.user(e.user.zone)},domProps:{textContent:t._s(e.user.nickname)}})]:[n("nuxt-link",{staticClass:"bangumi-avatar",attrs:{to:t.$alias.bangumi(e.bangumi.id)}},[n("v-img",{attrs:{lazy:!1,src:e.bangumi.avatar,width:"30"}})],1),t._v(" "),n("div",{staticClass:"info"},[n("p",{staticClass:"main-info"},[n("span",[t._v("UP：")]),t._v(" "),n("nuxt-link",{staticClass:"oneline",attrs:{to:t.$alias.user(e.user.zone)},domProps:{textContent:t._s(e.user.nickname)}})],1),t._v(" "),n("nuxt-link",{staticClass:"oneline",attrs:{to:t.$alias.bangumi(e.bangumi.id)},domProps:{textContent:t._s(e.bangumi.name)}})],1)]],2)])],1)])}),1):t._e()],1)])},[],!1,function(t){var e=n(276);e.__inject__&&e.__inject__(t)},null,"06e509ee");e.a=h.exports},506:function(t,e,n){"use strict";n.r(e);var o=n(177),r=n(287),l={name:"UserImage",components:{FlowList:o.a,ImageWaterfallFlow:r.a},props:{zone:{type:String,required:!0}},async asyncData({store:t,params:e}){await t.dispatch("flow/initData",{func:"getUserImage",type:"page",sort:"news",id:e.zone})}},c=n(1),component=Object(c.a)(l,function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("FlowList",{attrs:{id:t.zone,func:"getUserImage",type:"page",sort:"news"},scopedSlots:t._u([{key:"default",fn:function(e){var o=e.flow;return n("ImageWaterfallFlow",{attrs:{list:o,"user-zone":t.zone,"bangumi-id":""}})}}])})},[],!1,null,null,"5429c3d2");e.default=component.exports}};
//# sourceMappingURL=pins.chunk.2e907918.js.map