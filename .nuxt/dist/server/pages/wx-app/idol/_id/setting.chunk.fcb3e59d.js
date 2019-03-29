exports.ids=[68],exports.modules={193:function(t,e,o){"use strict";o.d(e,"i",function(){return r}),o.d(e,"r",function(){return n}),o.d(e,"h",function(){return c}),o.d(e,"c",function(){return d}),o.d(e,"o",function(){return l}),o.d(e,"f",function(){return _}),o.d(e,"m",function(){return m}),o.d(e,"e",function(){return f}),o.d(e,"p",function(){return h}),o.d(e,"a",function(){return v}),o.d(e,"n",function(){return $}),o.d(e,"j",function(){return k}),o.d(e,"d",function(){return x}),o.d(e,"b",function(){return w}),o.d(e,"g",function(){return y}),o.d(e,"q",function(){return j}),o.d(e,"l",function(){return C}),o.d(e,"k",function(){return N});const r=(t,{id:e})=>t.$axios.$get(`cartoon_role/${e}/stock_show`),n=(t,{id:e,amount:o})=>t.$axios.$post(`cartoon_role/${e}/buy_stock`,{amount:o}),c=(t,{id:e})=>t.$axios.$get(`cartoon_role/${e}/get_idol_deal`),d=(t,form)=>t.$axios.$post("cartoon_role/create_deal",form),l=(t,form)=>t.$axios.$post("cartoon_role/make_deal",form),_=(t,{id:e})=>t.$axios.$post("cartoon_role/delete_deal",{id:e}),m=t=>t.$axios.$get("cartoon_role/stock_meta"),f=(t,form)=>t.$axios.$post("cartoon_role/create_market_price_draft",form),h=(t,{is_agree:e,idol_id:o,draft_id:r})=>t.$axios.$post("cartoon_role/vote_market_price_draft",{is_agree:e,idol_id:o,draft_id:r}),v=(t,{idol_id:e,qq_group:o,lover_words:r,manager_id:n})=>t.$axios.$post("cartoon_role/change_idol_profile",{idol_id:e,qq_group:o,lover_words:r,manager_id:n}),$=t=>t.$axios.$get("cartoon_role/user_draft_work"),k=t=>t.$axios.$get("cartoon_role/can_use_income"),x=(t,{product_id:e,product_type:o,amount:r})=>t.$axios.$post("cartoon_role/create_buy_request",{product_id:e,product_type:o,amount:r}),w=(t,{order_id:e,result:o})=>t.$axios.$post("cartoon_role/check_product_request",{order_id:e,result:o}),y=(t,{order_id:e})=>t.$axios.$post("cartoon_role/delete_buy_request",{order_id:e}),j=(t,{order_id:e})=>t.$axios.$post("cartoon_role/over_buy_request",{order_id:e}),C=t=>t.$axios.$get("cartoon_role/get_mine_product_orders"),N=(t,{idol_id:e,days:o})=>t.$axios.$get("cartoon_role/get_idol_days_chart",{params:{idol_id:e,days:o}})},246:function(t,e){},247:function(t,e){},255:function(t,e){},256:function(t,e){},310:function(t,e,o){"use strict";o.r(e);var r=o(255),n=o.n(r);for(var c in r)"default"!==c&&function(t){o.d(e,t,function(){return r[t]})}(c);e.default=n.a},311:function(t,e,o){"use strict";o.r(e);var r=o(256),n=o.n(r);for(var c in r)"default"!==c&&function(t){o.d(e,t,function(){return r[t]})}(c);e.default=n.a},312:function(t,e,o){"use strict";var r=o(6);e.a={async fetch({store:t,req:e}){t.commit("SET_AUTH_TOKEN",Object(r.a)(e)),await t.dispatch("initAuth")}}},371:function(t,e,o){"use strict";o(246),o(2);var r=o(150),n=o.n(r),c=(o(247),o(151)),d=o.n(c),l=o(193),_={name:"ChangeIdolProfile",props:{idol:{type:Object,required:!0}},data(){return{qq_group:this.idol.qq_group,lover_words:this.idol.lover_words,manager_id:this.idol.manager?this.idol.manager.id:"",submitting:!1}},methods:{beforeSubmit(){this.submitting||(this.lover_words.length>20?this.$toast.error("留言给我缩减至20字以内重说！"):this.lover_words||this.qq_group?!this.qq_group||/^\d+$/.test(this.qq_group)?(this.manager_id&&!/^\d+$/.test(this.manager_id)&&this.$toast.error("经纪人的id是数字"),!this.qq_group||this.idol.qq_group?this.doSubmit():this.$confirm("QQ群号设置之后不能再修改，确认要设置吗?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(()=>{this.doSubmit()}).catch(()=>{})):this.$toast.error("QQ群号必须是数字"):this.$toast.error("内容不能为空"))},async doSubmit(){this.submitting=!0;try{await Object(l.a)(this,{idol_id:this.idol.id,qq_group:this.qq_group,manager_id:this.manager_id,lover_words:this.lover_words}),this.$toast.success("修改成功"),setTimeout(()=>{window.location.reload()},1e3)}catch(t){this.submitting=!1}}}},m=o(1);var f=Object(m.a)(_,function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{attrs:{id:"change-idol-profile"}},[t._ssrNode('<p class="tips">\n    修改特殊留言（一周只能修改一次，20字以内）：\n  </p> '),o("el-input",{attrs:{rows:3,type:"textarea",placeholder:"用简单的文字表达你的爱吧！"},model:{value:t.lover_words,callback:function(e){t.lover_words="string"==typeof e?e.trim():e},expression:"lover_words"}}),t._ssrNode(' <p class="tips">\n    修改QQ群号<span class="warn">（设置之后不能修改）</span>：\n  </p> '),o("el-input",{attrs:{placeholder:"填写QQ群号码"},model:{value:t.qq_group,callback:function(e){t.qq_group=e},expression:"qq_group"}}),t._ssrNode(' <div class="tips">\n    修改经纪人\n  </div> '),o("el-input",{attrs:{placeholder:"填写要任命的经纪人的邀请码"},model:{value:t.manager_id,callback:function(e){t.manager_id=e},expression:"manager_id"}}),t._ssrNode(" "),o("el-button",{attrs:{loading:t.submitting,type:"primary"},on:{click:t.beforeSubmit}},[t._v("\n    确认提交\n  ")])],2)},[],!1,function(t){var e=o(310);e.__inject__&&e.__inject__(t)},null,"761c648c").exports,h=(o(86),o(42)),v={name:"CreateChangeMarketPriceDraft",components:{"el-input-number":o.n(h).a},props:{idol:{type:Object,required:!0}},data:()=>({minLevel:500,stock_form:{submitting:!1,new_price:0,add_stock_count:0}}),computed:{minAddPrice(){let t;return(t=this.idol.star_count<4e3?.25*this.idol.market_price:.1*this.idol.market_price)<this.minLevel?parseFloat(this.minLevel).toFixed(2):parseFloat(t).toFixed(2)},curAddPrice(){return parseFloat(this.stock_form.new_price*this.stock_form.add_stock_count).toFixed(2)},totalMarketPrice(){return parseFloat(+this.idol.market_price+ +this.curAddPrice).toFixed(2)}},methods:{async submitAddStock(){if(!this.stock_form.submitting){this.stock_form.submitting=!0;try{await Object(l.e)(this,{idol_id:this.idol.id,add_stock_count:this.stock_form.add_stock_count,stock_price:this.stock_form.new_price}),this.$toast.success("修改成功"),setTimeout(()=>{window.location.reload()},1e3)}catch(t){this.stock_form.submitting=!1}}}}};var $={name:"IdolSetting",components:{ChangeIdolProfile:f,CreateChangeMarketPriceDraft:Object(m.a)(v,function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{attrs:{id:"create-change-market-price-draft"}},[t._ssrNode("<p>增发规则：</p> <ul><li>"+t._ssrEscape("每次增发的股份，不能小于 "+t._s(t.minLevel)+" 股")+"</li> <li>现阶段，不支持以每股价格低于 1.00 或高于 10.00 的价格进行增发</li></ul> <p>设置股价：</p> "),o("el-input-number",{attrs:{min:1,max:10,step:.01},model:{value:t.stock_form.new_price,callback:function(e){t.$set(t.stock_form,"new_price",e)},expression:"stock_form.new_price"}}),t._ssrNode(" <p>设置份额：</p> "),o("el-input-number",{attrs:{step:1,min:t.minLevel},model:{value:t.stock_form.add_stock_count,callback:function(e){t.$set(t.stock_form,"add_stock_count",e)},expression:"stock_form.add_stock_count"}}),t._ssrNode(" <p>"+t._ssrEscape("当前增发市值：￥"+t._s(t.curAddPrice))+"</p> <p>"+t._ssrEscape("增发后总市值：￥"+t._s(t.totalMarketPrice))+"</p> "),o("el-button",{staticClass:"submit-btn",attrs:{loading:t.stock_form.submitting,type:"primary"},on:{click:t.submitAddStock}},[t._v("\n    确认增发\n  ")])],2)},[],!1,function(t){var e=o(311);e.__inject__&&e.__inject__(t)},null,"05151bf7").exports,"el-collapse":d.a,"el-collapse-item":n.a},props:{idol:{type:Object,required:!0}},data:()=>({activeName:""}),computed:{currentUserId(){return this.$store.state.login?this.$store.state.user.id:0},isBoss(){return!!this.idol.boss&&this.idol.boss.id===this.currentUserId}}};var k=Object(m.a)($,function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{attrs:{id:"idol-setting"}},[t.isBoss?[o("el-collapse",{attrs:{accordion:""},model:{value:t.activeName,callback:function(e){t.activeName=e},expression:"activeName"}},[o("el-collapse-item",{attrs:{name:"0"}},[o("p",{staticClass:"title",attrs:{slot:"title"},slot:"title"},[t._v("\n          信息修改\n        ")]),t._v(" "),o("ChangeIdolProfile",{attrs:{idol:t.idol}})],1),t._v(" "),o("el-collapse-item",{attrs:{name:"1"}},[o("p",{staticClass:"title",attrs:{slot:"title"},slot:"title"},[t._v("\n          股权变更\n        ")]),t._v(" "),o("CreateChangeMarketPriceDraft",{attrs:{idol:t.idol}})],1)],1)]:t._ssrNode("<p><br> <br>\n    只有大股东可以做数据变更\n    <br> <br> <br></p>")],2)},[],!1,function(t){},null,"3e790571");e.a=k.exports},517:function(t,e,o){"use strict";o.r(e);var r=o(371),n=o(312),c=o(193),d={name:"WxAppIdolSetting",components:{IdolSetting:r.a},mixins:[n.a],data:()=>({idol:null}),asyncData({app:t,params:e,error:o}){const{id:r}=e;return Object(c.i)(t,{id:r}).then(data=>({idol:data.role})).catch(t=>{o({statusCode:t.statusCode,message:t.message})})}},l=o(1);var component=Object(l.a)(d,function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"wx-app-idol-setting"}},[this._ssrNode('<div class="container">',"</div>",[e("IdolSetting",{attrs:{idol:this.idol}})],1)])},[],!1,function(t){},null,"44318fca");e.default=component.exports}};
//# sourceMappingURL=setting.chunk.fcb3e59d.js.map