exports.ids=[59],exports.modules={182:function(t,e){},200:function(t,e,n){"use strict";n.r(e);var r=n(182),l=n.n(r);for(var o in r)"default"!==o&&function(t){n.d(e,t,function(){return r[t]})}(o);e.default=l.a},210:function(t,e,n){"use strict";var r={name:"TabContainer",props:{headers:{required:!0,type:Array},defIndex:{type:[Number,String],default:"0"},router:{type:Boolean,default:!1}},data(){let t;return{focusIndex:t=this.router?this.headers.map(t=>t.route).indexOf(this.$route.name):+this.defIndex}},watch:{$route(t){this.focusIndex=this.headers.map(t=>t.route).indexOf(t.name)},headers(t){this.focusIndex=t.map(t=>t.route).indexOf(this.$route.name)}},methods:{computeItemText:t=>"string"==typeof t?t:t.label||t.name||t.text,computeItemIcon:t=>!("string"==typeof t||!t.icon)&&`iconfont ic-${t.replace("ic-","")}`,handleTabSwitch(t){this.focusIndex!==t&&(this.router&&this.$router.push({name:this.headers[t].route,params:this.$route.params}),this.focusIndex=t,this.$emit("change",t))}}},l=n(1);var component=Object(l.a)(r,function(){var t=this,e=t.$createElement;return(t._self._c||e)("section",{staticClass:"tab-container"},[t._ssrNode("<header>"+t._ssrList(t.headers,function(e,n){return"<div"+t._ssrClass(null,{"is-active":n===t.focusIndex})+t._ssrStyle(null,{width:100/t.headers.length+"%"},null)+">"+(t.computeItemIcon(e)?"<i"+t._ssrClass(null,t.computeItemIcon(e))+"></i>":"\x3c!----\x3e")+" <span>"+t._ssrEscape(t._s(t.computeItemText(e)))+"</span></div>"})+"</header> "),t.router?t._e():t._ssrNode("<main>","</main>",t._l(t.headers,function(e,n){return t._ssrNode("<div"+t._ssrStyle(null,null,{display:n===t.focusIndex?"":"none"})+">","</div>",[t._t(n)],2)}),0)],2)},[],!1,function(t){var e=n(200);e.__inject__&&e.__inject__(t)},null,"2697cdf0");e.a=component.exports},213:function(t,e){},225:function(t,e,n){"use strict";e.a={data:()=>({uploadHeaders:{key:"",token:""},uploadConfig:{max:5},imageUploadAccept:["image/jpeg","image/png","image/jpg","image/gif"].toString(),imageUploadAction:"https://upload.qiniup.com",imagePrefix:"https://image.calibur.tv/",getUpTokenTimer:0,uploadPending:0,uploadImageTotal:0,uploadImageList:[]}),computed:{currentUser(){return this.$store.state.user}},watch:{currentUser:{handler:function(t){t&&t.uptoken&&(this.uploadHeaders.token=t.uptoken.upToken)},deep:!0,immediate:!0}},mounted(){this.getUpTokenTimer=setInterval(()=>{this.getUpToken()},18e5)},beforeDestroy(){this.getUpTokenTimer&&clearInterval(this.getUpTokenTimer)},methods:{async getUpToken(){try{await this.$store.dispatch("getUpToken")}catch(t){}},handleImageUploadError(t,e){this.uploadPending--,this.uploadImageList.forEach((t,n)=>{t.uid===e.uid&&this.uploadImageList.splice(n,1)}),this.$toast.error(`图片：${e.name} 上传失败`)},beforeImageUpload(t){const e=~this.imageUploadAccept.split(",").indexOf(t.type),n=t.size/1024/1024<this.uploadConfig.max;if(!e)return this.$toast.error(`仅支持上传${this.imageUploadAccept.replace(/image\//g,"").replace(/,/g,"、")}格式的图片`),!1;if(!n)return this.$toast.error(`图片大小不能超过 ${this.uploadConfig.max}MB!`),!1;return this.uploadHeaders.key=(({userId:t,page:e,file:n})=>`admin/${t}${e}/${(new Date).getTime()}-${Math.random().toString(36).substring(3,6)}.${n.type.split("/").pop()}`)({userId:this.currentUser.id,page:this.$route.path,file:t}),!0},handleImageUploadRemove(t){this.uploadImageList.forEach((e,n)=>{e.uid===t.uid&&this.uploadImageList.splice(n,1)})},handleImageUploadSuccess(t,e){this.uploadImageList.forEach((n,r)=>{n.uid===e.uid&&(this.uploadImageList[r]=Object.assign(n,{data:t.data,status:"success",url:this.$resize(`${this.imagePrefix}${t.data.url}`,{width:100})}))}),this.uploadImageTotal++,this.uploadPending--},handleImageUploadBefore(t){if(!this.currentUser)return this.$channel.$emit("sign-in"),!1;const e=-1!==this.imageUploadAccept.split(",").indexOf(t.type),n=t.size/1024/1024<this.uploadConfig.max;return e?n?(this.uploadHeaders.key=this.$utils.createFileName({userId:this.$store.state.user.id,type:this.$route.path,file:t}),this.uploadImageList.push({name:t.name,percentage:0,raw:t,size:t.size,status:"uploading",uid:t.uid}),this.uploadPending++,!0):(this.$toast.error(`图片大小不能超过 ${this.uploadConfig.max}MB!`),!1):(this.$toast.error("仅支持jpg, jpeg, png, gif格式的图片"),!1)}}}},237:function(t,e){},238:function(t,e,n){"use strict";n.d(e,"b",function(){return r}),n.d(e,"a",function(){return l}),n.d(e,"c",function(){return o});const r=(t,{id:e,only:n,hash:r,time:time})=>t.$axios.$get(`post/${e}/show`,{params:{only:n,hash:r,time:time}}),l=(t,{title:title,bangumiId:e,content:content,images:n,tags:r,desc:desc,geetest:l,is_creator:o})=>t.$axios.$post("post/create",{title:title,bangumiId:e,content:content,images:n,tags:r,desc:desc,geetest:l,is_creator:o}),o=t=>t.$axios.$get("post/tags")},264:function(t,e,n){"use strict";n(267);var r=n(156),l={name:"BangumiPicker",components:{"mt-picker":n.n(r).a},props:{value:{required:!0,type:[Number,String]},label:{type:Boolean,default:!0},lazy:{type:Boolean,default:!1},display:{type:Boolean,default:!0}},data:()=>({show:!1,loading:!1,fetched:!1,selected:!1,isFirst:!0,list:[{flex:1,defaultIndex:-1,values:[],textAlign:"center"}]}),computed:{user(){return this.$store.state.user},notInit(){return!this.list[0].values.length},placeholder(){return this.loading?"加载中...":this.notInit?"请先关注番剧":this.selected?this.list[0].values[this.list[0].defaultIndex].name:"点击选择番剧"}},mounted(){this.$watch("value",t=>{this.autoSelect(t)}),this.lazy?this.$watch("display",t=>{t&&this.getData()}):this.getData()},methods:{onClickSelect(){this.selected=!0,this.$emit("input",this.list[0].values[this.list[0].defaultIndex].id)},onSlideSelect(t,e){if(!e[0])return;const n=e[0].id;this.list[0].values.forEach((t,e)=>{t.id===n&&(this.list[0].defaultIndex=e,this.isFirst?this.isFirst=!1:(this.selected=!0,this.$emit("input",t.id)))})},openPicker(){this.fetched?this.notInit?this.$toast.error("请先关注番剧"):this.show=!0:this.getData()},async getData(){if(!this.loading&&this.user){this.loading=!0;try{this.list[0].values=await this.$store.dispatch("bangumi/getCurrentUserFollowBangumis"),this.autoSelect(this.value),this.fetched=!0}finally{this.loading=!1}}},autoSelect(t){this.list[0].values.forEach((e,n)=>{e.id-t||(this.selected=!0,this.list[0].defaultIndex=n)})}}},o=n(1),component=Object(o.a)(l,function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"bangumi-picker"},[t._ssrNode((t.label?"<span>番剧：</span>":"\x3c!----\x3e")+" <div>"+t._ssrEscape("\n    "+t._s(t.placeholder)+"\n  ")+"</div> "),n("v-drawer",{attrs:{from:"bottom",size:"250px","header-text":"选择番剧","submit-text":"确认"},on:{submit:t.onClickSelect},model:{value:t.show,callback:function(e){t.show=e},expression:"show"}},[n("mt-picker",{attrs:{slots:t.list,"value-key":"name"},on:{change:t.onSlideSelect}})],1)],2)},[],!1,null,null,"0290c29e");e.a=component.exports},265:function(t,e,n){"use strict";var r={name:"ImageUploader",mixins:[n(225).a],props:{listType:{type:String,default:"picture-card"},limit:{type:Number,default:1},loading:{type:Boolean,default:!1},required:{type:Boolean,default:!0}},mounted(){this.$channel.$on("image-upload-done",()=>{this.uploadImageList=[],this.uploadImageTotal=0,this.$refs.upload&&this.$refs.upload.clearFiles()}),this.getUpToken()},methods:{handleImageUploadExceed(){this.$toast.error(`最多可上传 ${this.limit} 张图片!`)},handleImageUploadEmit(){if(this.uploadPending)return void this.$toast.error("等待图片上传完成");if(this.required&&!this.uploadImageTotal)return void this.$toast.error("请先选择图片");const t=this.uploadImageList.filter(t=>t).map(t=>t.data);this.$emit("submit",1===this.limit?t[0]:t)}}},l=n(1);var component=Object(l.a)(r,function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("el-upload",{ref:"upload",attrs:{action:t.imageUploadAction,accept:t.imageUploadAccept,data:t.uploadHeaders,disabled:!0,multiple:t.limit>1,"before-upload":t.handleImageUploadBefore,"on-success":t.handleImageUploadSuccess,"on-error":t.handleImageUploadError,"on-remove":t.handleImageUploadRemove,"on-exceed":t.handleImageUploadExceed,"file-list":t.uploadImageList,"list-type":t.listType}},[t._v("\n    +\n  ")]),t._ssrNode(" "),n("el-button",{staticClass:"upload-btn",attrs:{loading:!!t.uploadPending||t.loading,type:"primary"},on:{click:t.handleImageUploadEmit}},[t._v("\n    "+t._s(t.uploadPending?"图片上传中...":"确认提交")+"\n  ")])],2)},[],!1,function(t){var e=n(276);e.__inject__&&e.__inject__(t)},null,"37120795");e.a=component.exports},267:function(t,e){},276:function(t,e,n){"use strict";n.r(e);var r=n(237),l=n.n(r);for(var o in r)"default"!==o&&function(t){n.d(e,t,function(){return r[t]})}(o);e.default=l.a},277:function(t,e){},278:function(t,e){},279:function(t,e){},280:function(t,e){},281:function(t,e,n){"use strict";n.d(e,"b",function(){return r}),n.d(e,"a",function(){return l});const r=(t,{id:e})=>t.$axios.$get(`question/qaq/${e}/show`),l=(t,{title:title,tags:e,content:content,images:n,intro:r,geetest:l})=>t.$axios.$post("question/qaq/create",{title:title,tags:e,content:content,images:n,intro:r,geetest:l})},282:function(t,e){},283:function(t,e){},284:function(t,e){},361:function(t,e){},362:function(t,e){},363:function(t,e){},364:function(t,e,n){"use strict";n.r(e);var r=n(277),l=n.n(r);for(var o in r)"default"!==o&&function(t){n.d(e,t,function(){return r[t]})}(o);e.default=l.a},365:function(t,e,n){"use strict";n.r(e);var r=n(278),l=n.n(r);for(var o in r)"default"!==o&&function(t){n.d(e,t,function(){return r[t]})}(o);e.default=l.a},366:function(t,e,n){"use strict";n.r(e);var r=n(279),l=n.n(r);for(var o in r)"default"!==o&&function(t){n.d(e,t,function(){return r[t]})}(o);e.default=l.a},367:function(t,e,n){"use strict";n.r(e);var r=n(280),l=n.n(r);for(var o in r)"default"!==o&&function(t){n.d(e,t,function(){return r[t]})}(o);e.default=l.a},368:function(t,e,n){"use strict";n.r(e);var r=n(282),l=n.n(r);for(var o in r)"default"!==o&&function(t){n.d(e,t,function(){return r[t]})}(o);e.default=l.a},369:function(t,e,n){"use strict";n.r(e);var r=n(283),l=n.n(r);for(var o in r)"default"!==o&&function(t){n.d(e,t,function(){return r[t]})}(o);e.default=l.a},370:function(t,e,n){"use strict";n.r(e);var r=n(284),l=n.n(r);for(var o in r)"default"!==o&&function(t){n.d(e,t,function(){return r[t]})}(o);e.default=l.a},438:function(t,e,n){"use strict";n.r(e);n(361);var r=n(162),l=n.n(r),o=(n(362),n(163)),c=n.n(o),d=n(51),m=n(210),h=(n(363),n(164)),f=n.n(h),v=(n(213),n(154)),_=n.n(v),$=n(264),x=n(265),w=n(238),I={name:"VChecklist",props:{max:{type:Number,default:5},title:{type:String,default:""},align:{type:String,default:"left"},options:{type:Array,required:!0},value:{type:Array,required:!0}},data(){return{currentValue:this.value}},computed:{limit(){return this.max<this.currentValue.length}},watch:{value(t){this.currentValue=t},currentValue(t){this.limit&&t.pop(),this.$emit("input",t)}}},k=n(1);var y={name:"CreatePostDrawer",components:{VChecklist:Object(k.a)(I,function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"mint-checklist",class:{"is-limit":t.max<=t.currentValue.length},on:{change:function(e){return t.$emit("change",t.currentValue)}}},[t._ssrNode((t.title?'<label class="mint-checklist-title">'+t._ssrEscape(t._s(t.title))+"</label>":"\x3c!----\x3e")+" "+t._ssrList(t.options,function(option){return'<div class="mint-checklist-item"><label slot="title" class="mint-checklist-label"><span'+t._ssrClass("mint-checkbox",{"is-right":"right"===t.align})+"><input"+t._ssrAttr("disabled",option.disabled)+' type="checkbox"'+t._ssrAttr("value",option.value||option)+t._ssrAttr("checked",Array.isArray(t.currentValue)?t._i(t.currentValue,option.value||option)>-1:t.currentValue)+' class="mint-checkbox-input"> <span class="mint-checkbox-core"></span></span> <span class="mint-checkbox-label">'+t._ssrEscape(t._s(option.label||option))+"</span></label></div>"}))])},[],!1,function(t){var e=n(364);e.__inject__&&e.__inject__(t)},null,"16a7dff2").exports,BangumiPicker:$.a,ImageUploader:x.a,"mt-switch":_.a},data:()=>({open:!1,exceed:4,content:"",title:"",bangumiId:"",tags:[],selectedTags:[],is_creator:!1,submitting:!1,openPostTagSelectDrawer:!1}),computed:{displayTags(){return this.selectedTags.map(t=>({id:t,name:this.tags.filter(a=>a.value===t)[0].label}))}},mounted(){this.$channel.$on("drawer-open-write-post",()=>{this.open=!0,this.getPostTags()})},methods:{submit(t){this.submitting||(this.content?this.title?this.bangumiId?(this.submitting=!0,this.$toast.loading("加载中"),this.$captcha({ctx:this,success:async({data:data})=>{try{const e=await Object(w.a)(this,{title:this.title,bangumiId:this.bangumiId,desc:this.content.substring(0,120),content:this.content,is_creator:this.is_creator,tags:this.selectedTags,geetest:data,images:t});this.title="",this.content="",this.$channel.$emit("image-upload-done"),this.open=!1,this.$store.commit("UPDATE_USER_EXP",e.exp),this.$toast.success(e.message).then(()=>{window.location=this.$alias.post(e.data)})}finally{this.submitting=!1}},ready:()=>{this.$toast.stop()},close:()=>{this.submitting=!1}})):this.$toast.error("请选择要投稿的番剧！"):this.$toast.error("标题不能为空！"):this.$toast.error("内容不能为空！"))},async getPostTags(){if(!this.tags.length){try{const t=JSON.parse(sessionStorage.getItem("cache-post-tags"));if(t)return void(this.tags=t)}catch(t){}try{const t=await Object(w.c)(this);this.tags=t.map(t=>({label:t.name,value:t.id})),sessionStorage.setItem("cache-post-tags",JSON.stringify(this.tags))}catch(t){}}}}};var C=Object(k.a)(y,function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-drawer",{staticClass:"post-write-drawer",attrs:{"header-text":"发帖",from:"right",size:"100%"},model:{value:t.open,callback:function(e){t.open=e},expression:"open"}},[n("div",{staticClass:"container"},[n("input",{directives:[{name:"model",rawName:"v-model.trim",value:t.title,expression:"title",modifiers:{trim:!0}}],staticClass:"title",attrs:{type:"text",maxlength:"40",placeholder:"加个标题哟~"},domProps:{value:t.title},on:{input:function(e){e.target.composing||(t.title=e.target.value.trim())},blur:function(e){return t.$forceUpdate()}}}),t._v(" "),n("div",{staticClass:"field-item"},[n("span",[t._v("番剧：")]),t._v(" "),n("BangumiPicker",{attrs:{label:!1,lazy:!0,display:t.open},model:{value:t.bangumiId,callback:function(e){t.bangumiId=e},expression:"bangumiId"}})],1),t._v(" "),n("div",{staticClass:"field-item"},[n("span",[t._v("原创：")]),t._v(" "),n("mt-switch",{model:{value:t.is_creator,callback:function(e){t.is_creator=e},expression:"is_creator"}})],1),t._v(" "),n("div",{staticClass:"field-item"},[n("span",[t._v("标签：")]),t._v(" "),n("div",{staticClass:"tags",on:{click:function(e){t.openPostTagSelectDrawer=!0}}},[t.selectedTags.length?t._l(t.displayTags,function(e){return n("span",{key:e.id,domProps:{textContent:t._s(e.name)}})}):[t._v("\n          点击选择标签\n        ")]],2)]),t._v(" "),n("textarea",{directives:[{name:"model",rawName:"v-model.trim",value:t.content,expression:"content",modifiers:{trim:!0}}],staticClass:"content",attrs:{placeholder:"来吧，尽情的（在8000字以内）发挥吧",maxlength:"8000"},domProps:{value:t.content},on:{input:function(e){e.target.composing||(t.content=e.target.value.trim())},blur:function(e){return t.$forceUpdate()}}}),t._v(" "),n("ImageUploader",{attrs:{loading:t.submitting,limit:t.exceed,required:!1},on:{submit:t.submit}})],1),t._v(" "),n("v-drawer",{attrs:{"header-text":"选择标签","submit-text":"确认",from:"bottom",size:"70%"},model:{value:t.openPostTagSelectDrawer,callback:function(e){t.openPostTagSelectDrawer=e},expression:"openPostTagSelectDrawer"}},[n("VChecklist",{attrs:{options:t.tags,max:3},model:{value:t.selectedTags,callback:function(e){t.selectedTags=e},expression:"selectedTags"}})],1)],1)},[],!1,function(t){var e=n(365);e.__inject__&&e.__inject__(t)},null,"174dae75").exports,S=(n(267),n(156)),U=n.n(S),P=n(50),T={name:"VField",props:{label:{type:String,default:""},value:{required:!0,type:[Number,String]},placeholder:{type:String,default:""},disabled:{type:Boolean,default:!1},type:{type:String,default:"text"},labelSize:{type:String,default:"100px"}},data(){return{text:this.value}},watch:{value(t){this.text=t},text(t){this.$emit("input",t)}}};var A={name:"CreateImageDrawer",components:{"v-field":Object(k.a)(T,function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"v-field"},[t._ssrNode('<div class="label"'+t._ssrStyle(null,{width:t.labelSize},null)+">"+t._ssrEscape(t._s(t.label))+'</div> <div class="close"'+t._ssrStyle(null,null,{display:t.text&&!t.disabled?"":"none"})+'><span>×</span></div> <div class="input">'+("checkbox"===t.type?"<input"+t._ssrAttr("placeholder",t.placeholder)+' type="checkbox"'+t._ssrAttr("checked",Array.isArray(t.text)?t._i(t.text,null)>-1:t.text)+">":"radio"===t.type?"<input"+t._ssrAttr("placeholder",t.placeholder)+' type="radio"'+t._ssrAttr("checked",t._q(t.text,null))+">":"<input"+t._ssrAttr("placeholder",t.placeholder)+t._ssrAttr("type",t.type)+t._ssrAttr("value",t.text)+">")+"</div>")])},[],!1,function(t){var e=n(366);e.__inject__&&e.__inject__(t)},null,"c78829b4").exports,"mt-switch":_.a,"mt-picker":U.a,BangumiPicker:$.a,ImageUploader:x.a},data:()=>({show:!1,sort:"image",loadedUserAlbum:!1,loadingBangumi:!1,loadingUserAlbum:!1,openPickerDrawer:!1,openBangumisDrawer:!1,openImageAlbumDrawer:!1,submitting:!1,albumSlots:[{flex:1,defaultIndex:0,values:[],textAlign:"center"}],album:{name:"",bangumiId:"",creator:!1,cartoon:!1},image:{name:"",creator:!1,bangumiId:"",selectedAlbum:!1},isSingleModel:!0}),computed:{imageAlbumPlaceholder(){return this.loadingUserAlbum?"加载中...":this.albumSlots[0].values.length?this.image.selectedAlbum?this.getSelectedMeta("album","name"):"点击选择相册":"请先创建相册"},pickerDrawerHeaderText(){return this.openBangumisDrawer?"番剧":this.openImageAlbumDrawer?"相册":"选项卡"},user(){return this.$store.state.user||{}}},mounted(){this.$channel.$on("open-create-image-drawer",()=>{this.getUserAlbum(),this.show=!0})},methods:{switchTab(t){this.sort=t,this.$channel.$emit("image-upload-done")},switchPickerDrawer(t){this.openBangumisDrawer=!1,this.openImageAlbumDrawer=!1,this[t]=!0,this.openPickerDrawer=!0},handleAlbumPickerBtnClick(){this.loadingUserAlbum?this.$toast.error("数据加载中"):this.albumSlots[0].values.length?(this.image.selectedAlbum=!0,this.switchPickerDrawer("openImageAlbumDrawer")):this.$toast.error("还没有创建相册")},onAlbumValuesChange(t,e){if(!e[0])return;const n=e[0].id;this.albumSlots[0].values.forEach((t,e)=>{t.id===n&&(this.albumSlots[0].defaultIndex=e)})},async createAlbum(t){if(this.album.name)if(this.album.name.length>30)this.$toast.error("相册名字请缩减至 30 字以内");else if(this.album.bangumiId){if(!this.submitting){this.submitting=!0,this.$toast.loading("创建中");try{const e=await Object(P.a)(this,Object.assign({},t,{bangumi_id:this.album.bangumiId,is_cartoon:!1,name:this.album.name,is_creator:this.album.creator,part:0})),data=e.data;this.albumSlots[0].values.unshift(data),this.albumSlots[0].defaultIndex=0,this.$toast.success(e.message),this.$store.commit("UPDATE_USER_EXP",e.exp),this.image.albumId=data.id,this.image.selectedAlbum=!0,this.isSingleModel=!1,this.switchTab("image"),this.album={name:"",bangumiId:"",creator:!1,cartoon:!1},this.$channel.$emit("image-upload-done")}finally{this.submitting=!1}}}else this.$toast.error("请选择要投稿的番剧");else this.$toast.error("请填写相册名字")},async getUserAlbum(){if(!this.loadingUserAlbum&&!this.loadedUserAlbum){this.loadingUserAlbum=!0;try{this.albumSlots[0].values=await Object(P.d)(this),this.loadedUserAlbum=!0}finally{this.loadingUserAlbum=!1}}},async createImage(t){if(this.isSingleModel){if(!this.image.bangumiId)return void this.$toast.error("请选择要投稿的番剧");if(this.image.name.length>30)return void this.$toast.error("图片名字请缩减至 30 字以内")}else if(!this.image.selectedAlbum)return void this.$toast.error("请选择要上传的相册");if(this.submitting)return;let e;this.submitting=!0,this.$toast.loading("上传中...");try{this.isSingleModel?this.$captcha({ctx:this,success:async({data:data})=>{const n=await Object(P.f)(this,Object.assign({},t,{is_creator:this.image.creator,bangumi_id:this.image.bangumiId,name:this.image.name,geetest:data}));e=n.data,this.show=!1,this.$store.commit("UPDATE_USER_EXP",n.exp),this.$toast.success(n.message).then(()=>{window.location=this.$alias.image(e)}),this.$channel.$emit("image-upload-done")},close:()=>{this.submitting=!1}}):(e=this.getSelectedMeta("album","id"),await Object(P.e)(this,{album_id:e,images:t}),this.$toast.success("上传成功"),this.show=!1,setTimeout(()=>{window.location=this.$alias.image(e)},400),this.$channel.$emit("image-upload-done"))}finally{this.submitting=!1}},getSelectedMeta(t,e){const n=`${t}Slots`;return this[n][0].values.length?this[n][0].values[this[n][0].defaultIndex][e]:0}}};var E=Object(k.a)(A,function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-drawer",{staticClass:"create-image-drawer",attrs:{from:"bottom",size:"100%","header-text":"上传图片"},model:{value:t.show,callback:function(e){t.show=e},expression:"show"}},[n("div",{staticClass:"tabs"},[n("button",{class:{active:"image"===t.sort},on:{click:function(e){return t.switchTab("image")}}},[t._v("\n      上传图片\n    ")]),t._v(" "),n("button",{class:{active:"album"===t.sort},on:{click:function(e){return t.switchTab("album")}}},[t._v("\n      新建相册\n    ")])]),t._v(" "),n("div",{staticClass:"container"},[n("v-drawer",{staticClass:"bangumis-drawer",attrs:{"header-text":t.pickerDrawerHeaderText,from:"bottom",size:"250px"},model:{value:t.openPickerDrawer,callback:function(e){t.openPickerDrawer=e},expression:"openPickerDrawer"}},[t.openImageAlbumDrawer?n("mt-picker",{attrs:{slots:t.albumSlots,"value-key":"name"},on:{change:t.onAlbumValuesChange}}):t._e()],1),t._v(" "),"image"===t.sort?[n("div",{staticClass:"field"},[n("span",[t._v("单张模式：")]),t._v(" "),n("mt-switch",{model:{value:t.isSingleModel,callback:function(e){t.isSingleModel=e},expression:"isSingleModel"}})],1),t._v(" "),t.isSingleModel?[n("v-field",{attrs:{label:"名字",placeholder:"请给图片起个名字","label-size":"48px"},model:{value:t.image.name,callback:function(e){t.$set(t.image,"name",e)},expression:"image.name"}}),t._v(" "),n("div",{staticClass:"field"},[n("span",[t._v("番剧：")]),t._v(" "),n("BangumiPicker",{attrs:{label:!1,lazy:!0,display:t.show&&"image"===t.sort},model:{value:t.image.bangumiId,callback:function(e){t.$set(t.image,"bangumiId",e)},expression:"image.bangumiId"}})],1),t._v(" "),n("div",{staticClass:"field"},[n("span",[t._v("原创：")]),t._v(" "),n("mt-switch",{model:{value:t.image.creator,callback:function(e){t.$set(t.image,"creator",e)},expression:"image.creator"}})],1),t._v(" "),n("div",{staticClass:"field"},[n("span",[t._v("图片：")]),t._v(" "),n("ImageUploader",{on:{submit:t.createImage}})],1)]:[n("div",{staticClass:"field"},[n("span",[t._v("相册：")]),t._v(" "),n("div",{domProps:{textContent:t._s(t.imageAlbumPlaceholder)},on:{click:t.handleAlbumPickerBtnClick}})]),t._v(" "),n("div",{staticClass:"field"},[n("span",[t._v("图片：")]),t._v(" "),n("ImageUploader",{attrs:{limit:7},on:{submit:t.createImage}})],1)]]:"album"===t.sort?[n("v-field",{attrs:{label:"名字",placeholder:"请填写相册名字","label-size":"48px"},model:{value:t.album.name,callback:function(e){t.$set(t.album,"name",e)},expression:"album.name"}}),t._v(" "),n("div",{staticClass:"field"},[n("span",[t._v("番剧：")]),t._v(" "),n("BangumiPicker",{attrs:{label:!1,lazy:!0,display:t.show&&"album"===t.sort},model:{value:t.album.bangumiId,callback:function(e){t.$set(t.album,"bangumiId",e)},expression:"album.bangumiId"}})],1),t._v(" "),n("div",{staticClass:"field"},[n("span",[t._v("原创：")]),t._v(" "),n("mt-switch",{model:{value:t.album.creator,callback:function(e){t.$set(t.album,"creator",e)},expression:"album.creator"}})],1),t._v(" "),n("div",{staticClass:"field"},[n("span",[t._v("封面：")]),t._v(" "),n("ImageUploader",{on:{submit:t.createAlbum}})],1)]:t._e()],2)])},[],!1,function(t){var e=n(367);e.__inject__&&e.__inject__(t)},null,"4d89b998").exports,j=n(281),D={name:"CreateQuestionDrawer",components:{BangumiPicker:$.a,ImageUploader:x.a},data:()=>({form:{title:"",bangumiId:"",content:""},rules:{title:[{validator:(t,e,n)=>{e||n(new Error("请输入问题标题")),e.length>30&&n(new Error("标题最多 30 个字")),n()},trigger:"change"}],bangumiId:[{validator:(t,e,n)=>{e||n(new Error("至少选择 1 个番剧")),n()},trigger:"submit"}],content:[{validator:(t,e,n)=>{e||n(new Error("问题不能为空")),n()},trigger:"submit"}]},exceed:7,submitting:!1,show:!1}),mounted(){this.$channel.$on("drawer-open-write-question",()=>{this.show=!0})},methods:{submit(t){this.$refs.form.validate(e=>{if(!e)return!1;this.submitting||(this.submitting=!0,this.$captcha({ctx:this,success:async({data:data})=>{try{const e=await Object(j.a)(this,{title:this.form.title,tags:[this.form.bangumiId],intro:this.form.content.substring(0,120),content:this.form.content,images:t,geetest:data});this.images=[],this.$emit("submit"),this.$store.commit("UPDATE_USER_EXP",e.exp),this.$toast.success(e.message).then(()=>{window.location=this.$alias.question(e.data)})}finally{this.submitting=!1}},close:()=>{this.submitting=!1}}))})}}};var O=Object(k.a)(D,function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-drawer",{attrs:{from:"bottom",size:"100%","header-text":"提问"},model:{value:t.show,callback:function(e){t.show=e},expression:"show"}},[n("div",{staticClass:"container"},[n("el-form",{ref:"form",attrs:{id:"create-question-form",model:t.form,rules:t.rules,disabled:t.submitting,"label-width":"45px"}},[n("el-form-item",{attrs:{label:"标题",prop:"title"}},[n("el-input",{attrs:{maxlength:"30",placeholder:"问题标题"},model:{value:t.form.title,callback:function(e){t.$set(t.form,"title","string"==typeof e?e.trim():e)},expression:"form.title"}})],1),t._v(" "),n("el-form-item",{attrs:{label:"番剧",prop:"bangumiId"}},[n("BangumiPicker",{attrs:{label:!1,lazy:!0,display:t.show},model:{value:t.form.bangumiId,callback:function(e){t.$set(t.form,"bangumiId",e)},expression:"form.bangumiId"}})],1),t._v(" "),n("el-form-item",{attrs:{label:"描述",prop:"content"}},[n("el-input",{attrs:{rows:5,placeholder:"问题背景，条件等详细信息",type:"textarea",maxlength:"1000"},model:{value:t.form.content,callback:function(e){t.$set(t.form,"content","string"==typeof e?e.trim():e)},expression:"form.content"}})],1),t._v(" "),n("el-form-item",{attrs:{label:"图片"}},[n("ImageUploader",{attrs:{loading:t.submitting,limit:t.exceed,required:!1},on:{submit:t.submit}})],1)],1)],1)])},[],!1,function(t){var e=n(368);e.__inject__&&e.__inject__(t)},null,"9d3d878a").exports,B={name:"VCreatorMenu",components:{PaletteButton:f.a,CreatePostDrawer:C,CreateImageDrawer:E,CreateQuestionDrawer:O},data:()=>({backdropId:0,lastScroll:0,isScrollTop:!0}),computed:{isGuest(){return!this.$store.state.login},userLevel(){return this.isGuest?0:this.$store.state.user.exp.level}},mounted(){window.addEventListener("scroll",this.$utils.throttle(()=>{const t=document.documentElement.scrollTop||document.body.scrollTop;this.isScrollTop=this.lastScroll>t,this.lastScroll=t},200))},methods:{handlePaletteOpen(){this.backdropId=this.$backdrop.show({ele:this.$refs.palette.$el,click:()=>{this.close()}})},close(){this.$refs.palette.collapse()},handlePaletteClose(){this.$backdrop.hide(this.backdropId)},handleImageClick(){this.close(),this.isGuest?this.$channel.$emit("sign-in"):this.$channel.$emit("open-create-image-drawer")},handlePostClick(){this.close(),this.isGuest?this.$channel.$emit("sign-in"):this.$channel.$emit("drawer-open-write-post")},handleQuestionClick(){this.close(),this.isGuest?this.$channel.$emit("sign-in"):this.userLevel<3?this.$toast.error("3级以上才能提问"):this.$channel.$emit("drawer-open-write-question")},handleScoreClick(){this.close(),this.isGuest?this.$channel.$emit("sign-in"):this.userLevel<3?this.$toast.error("3级以上才能写漫评"):window.location=this.$alias.createScore}}};var N=Object(k.a)(B,function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"creators-container"},[t._ssrNode('<div id="creator-menu-wrap">',"</div>",[n("PaletteButton",{ref:"palette",staticClass:"palette-button",class:{isScrollTop:t.isScrollTop},attrs:{content:"",direction:"t"},on:{expand:t.handlePaletteOpen,collapse:t.handlePaletteClose}},[n("button",{staticClass:"ic-btn el-icon-picture",on:{click:t.handleImageClick}}),t._v(" "),n("button",{staticClass:"ic-btn score-btn",on:{click:t.handleScoreClick}},[n("i",{staticClass:"el-icon-edit"})]),t._v(" "),n("button",{staticClass:"ic-btn iconfont icon-pinglun",on:{click:t.handlePostClick}}),t._v(" "),n("button",{staticClass:"ic-btn el-icon-question",on:{click:t.handleQuestionClick}})])],1),t._ssrNode(" "),t.isGuest?t._e():[n("CreatePostDrawer"),t._ssrNode(" "),n("CreateImageDrawer"),t._ssrNode(" "),n("CreateQuestionDrawer")]],2)},[],!1,function(t){var e=n(369);e.__inject__&&e.__inject__(t)},null,"c9c3e750").exports,z={name:"TheWorld",components:{"mt-swipe":c.a,"mt-swipe-item":l.a,TabContainer:m.a,CreatorMenu:N},data:()=>({loops:[],headers:[{label:"帖子",route:"world-post"},{label:"相册",route:"world-pins"},{label:"漫评",route:"world-review"},{label:"问答",route:"world-qaq"}]}),asyncData:({app:t})=>Object(d.b)(t).then(t=>({loops:t})),head:{meta:[{hid:"description",name:"description",content:"站内热点"}]}};var L=Object(k.a)(z,function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"the-world"}},[t.loops.length?t._ssrNode('<div class="carousel">',"</div>",[n("no-ssr",[n("mt-swipe",{attrs:{"show-indicators":!1}},t._l(t.loops,function(e,r){return n("mt-swipe-item",{key:r},[n("a",{staticClass:"background",style:{backgroundImage:"url("+t.$resize(e.poster,{width:600,height:300})+")"},attrs:{href:e.link}},[n("div",{staticClass:"intro"},[n("p",{staticClass:"title oneline",domProps:{textContent:t._s(e.title)}}),t._v(" "),n("p",{staticClass:"desc oneline",domProps:{textContent:t._s(e.desc)}})])])])}),1)],1)],1):t._e(),t._ssrNode(' <div class="hr"></div> '),n("TabContainer",{attrs:{headers:t.headers,router:!0}}),t._ssrNode(" "),n("nuxt-child"),t._ssrNode(" "),n("no-ssr",[n("CreatorMenu")],1)],2)},[],!1,function(t){var e=n(370);e.__inject__&&e.__inject__(t)},null,"1027fd1e");e.default=L.exports}};
//# sourceMappingURL=world.chunk.82c140bc.js.map