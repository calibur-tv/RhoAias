<style lang="scss">
#app-handbook {
  font-size: 12px;
  line-height: 20px;

  .title {
    height: 48px;
    line-height: 48px;
    font-weight: 500;
    font-size: 13px;
    padding-left: 15px;
    position: relative;

    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 16px;
      width: 5px;
      height: 16px;
      background-color: $color-pink-normal;
      border-radius: 2px;
    }
  }

  .subtitle {
    margin-bottom: 5px;
  }

  .p {
    text-indent: 2em;
    font-size: 12px;
    line-height: 20px;
    margin-bottom: 5px;
  }

  .strong {
    color: $color-pink-normal;
    font-weight: bold;
  }

  ul {
    margin-left: 2em;
    margin-bottom: 5px;
  }

  li {
    list-style-type: disc;
    font-size: 12px;
  }
}
</style>

<template>
  <div
    id="app-handbook"
    class="container"
  >
    <no-ssr>
      <el-collapse
        v-model="activeName"
        accordion
      >
        <el-collapse-item name="1">
          <h4
            slot="title"
            class="title"
          >
            金币系统
          </h4>
          <h5 class="subtitle">什么是金币系统：</h5>
          <p class="p">
            金币系统是 calibur 的一个特点，大家可以通过很多方式获得这种虚拟币，
            <span class="strong">1金币 = 1人民币，满100金币可提现</span>。
          </p>
          <h5 class="subtitle">获得金币的渠道：</h5>
          <ul>
            <li>每天签到可获得一枚金币（签到获得的金币无法提现，但可以打赏给别人）</li>
            <li>发表帖子、图片等，在发表时勾选了"原创"，就可以开启投食，其它人可以给你投食</li>
            <li>每个用户都有自己的邀请码，其它用户注册时输入你的邀请码，每有一个人注册，你就会获得一枚金币</li>
            <li>抱歉暂不支持氪金~</li>
          </ul>
          <h5 class="subtitle">失去金币：</h5>
          <ul>
            <li>当你给其它内容投食时，内容的发表者会获得一枚金币，而你会损失一枚金币</li>
            <li>当你发表的内容获得金币后，但是被删除了（违规被删除或自己删除），该内容获得的金币就会丢失</li>
            <li>当你在偶像区为喜欢的角色应援时，每应援一次，金币-1（鉴定真爱的时刻到了，2333）</li>
            <li>提现的时候，你提多少，就扣多少</li>
          </ul>
          <h5 class="subtitle">如何提现：</h5>
          <p class="p">
            目前不支持自动提现，需加QQ群：<span class="strong">718529809</span>，加群时附上你的邀请码，审核通过后可进群提现
          </p>
          <h5 class="subtitle">重要提醒：</h5>
          <p class="p">金币系统是站长送给大家的礼物，希望大家能在二次元付出时间与感情的同时，不仅可以收获精神回报，也能得到物质回报，因此是一项福利，所以不限于以下情况是无法提现的</p>
          <ul>
            <li>非原创的内容，却勾选了原创。如：转载他人帖子、转载其他画师的作品，一旦发现，不予提现</li>
            <li>通过创建多个账号来刷金币，或者操控金币者，无法提现，并可能随时被封号处理</li>
            <li>「不利于社区发展」的内容，无法提现</li>
          </ul>
          <p class="p">
            以上措施的目的都是为了维护社区的健康发展，以及公平竞争性，如果有人恶意利用金币规则，绝对严惩。而通过自己的努力付出获得的金币，希望大家踊跃找我来提现。
          </p>
        </el-collapse-item>
        <el-collapse-item name="2">
          <h4
            slot="title"
            class="title"
          >
            等级系统
          </h4>
          <h5 class="subtitle">什么是等级系统：</h5>
          <p class="p">
            在 calibur 每个漫友初始等级为 1，通过签到或发表内容可获得经验，经验达到等级要求，就会升级
          </p>
          <h5 class="subtitle">等级有什么用：</h5>
          <p class="p">
            等级越高可以获得的特权越多，目前等级的作用还比较小，仅有以下作用：
          </p>
          <ul>
            <li>3级以后才可以看视频<span class="strong">（本周更新的连载最新一集没有等级限制）</span></li>
            <li>3级以后才可以发漫评、在问答区提问<span class="strong">（目前发表漫评、问答区仅在网页端开放，APP相关还在研发中）</span></li>
          </ul>
          <h5 class="subtitle">如何获得经验：</h5>
          <ul>
            <li>每日签到：+2</li>
            <li>发帖子：+4</li>
            <li>写漫评：+5</li>
            <li>写回答：+4</li>
            <li>传图片（限图片区）：+3</li>
            <li>提问题（限问答区）：+3</li>
            <li>写评论（包括跟帖）：+2</li>
            <li>回复评论：+1</li>
            <li>获得喜欢：+2</li>
            <li>获得收藏：+2</li>
            <li>获得金币：+3</li>
          </ul>
          <h5 class="subtitle">什么情况没有经验：</h5>
          <ul>
            <li>评论/回复自己的内容</li>
            <li>发表少于15字的内容，或发表无语意的内容</li>
            <li>如果内容被删除，会掉经验和等级</li>
            <li>大量重复刷屏的内容，会被删除</li>
            <li>没有参与话题讨论的不相关内容，会被删除</li>
          </ul>
          <h5 class="subtitle">关于水贴：</h5>
          <p class="p">
            我知道3级的限制会对新人很不友好，但是没办法，站长没足够的资金去支撑过高的视频流量，因此才限流的，
            calibur 还在初始阶段，有很多不完善的地方，很多功能需要站长去开发，但是现在每天都得盯着后台删水贴，浪费了很多时间
          </p>
          <p class="p">
            发水贴不仅浪费你自己的时间，肯定会被删掉，经验也会丢失，同时浪费站长的时间，无法为大家提供更好的功能，这样就进入了一个死循环，
            还请大家多多谅解，不要水贴了~~~
          </p>
        </el-collapse-item>
      </el-collapse>
    </no-ssr>
  </div>
</template>

<script>
import { Collapse, CollapseItem } from "element-ui";

export default {
  name: "AppHandbook",
  components: {
    "el-collapse": Collapse,
    "el-collapse-item": CollapseItem
  },
  data() {
    return {
      activeName: ""
    };
  }
};
</script>
