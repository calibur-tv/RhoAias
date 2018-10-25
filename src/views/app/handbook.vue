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
            团子系统
          </h4>
          <h5 class="subtitle">什么是团子系统：</h5>
          <p class="p">
            团子系统是 calibur 的一个特点，大家可以通过很多方式获得这种虚拟币，
            <span class="strong">1团子 = 1人民币，满100团子可提现</span>。
          </p>
          <h5 class="subtitle">获得团子的渠道：</h5>
          <ul>
            <li>每天签到可获得一个团子（签到获得的团子无法提现，但可以打赏给别人）</li>
            <li>发表帖子、图片等，在发表时勾选了"原创"，就可以开启投食，其它人可以给你投食</li>
            <li>每个用户都有自己的邀请码，其它用户注册时输入你的邀请码，每有一个人注册，你就会获得一个团子</li>
            <li>抱歉暂不支持氪金~</li>
          </ul>
          <h5 class="subtitle">失去团子：</h5>
          <ul>
            <li>当你给其它内容投食时，内容的发表者会获得一个团子，而你会损失一个团子</li>
            <li>当你发表的内容获得团子后，但是被删除了（违规被删除或自己删除），该内容获得的团子就会丢失</li>
            <li>当你在偶像区为喜欢的角色应援时，每应援一次，团子-1（鉴定真爱的时刻到了，2333）</li>
            <li>提现的时候，你提多少，就扣多少</li>
          </ul>
          <h5 class="subtitle">如何提现：</h5>
          <p class="p">
            目前不支持自动提现，需加QQ群：<span class="strong">718529809</span>，加群时附上你的邀请码，审核通过后可进群提现
          </p>
          <h5 class="subtitle">重要提醒：</h5>
          <p class="p">团子系统是站长送给大家的礼物，希望大家能在二次元付出时间与感情的同时，不仅可以收获精神回报，也能得到物质回报，因此是一项福利，所以不限于以下情况是无法提现的</p>
          <ul>
            <li>非原创的内容，却勾选了原创。如：转载他人帖子、转载其他画师的作品，一旦发现，不予提现</li>
            <li>通过创建多个账号来刷团子，或者操控团子者，无法提现，并可能随时被封号处理</li>
            <li>「不利于社区发展」的内容，无法提现</li>
          </ul>
          <p class="p">
            以上措施的目的都是为了维护社区的健康发展，以及公平竞争性，如果有人恶意利用团子规则，绝对严惩。而通过自己的努力付出获得的团子，希望大家踊跃找我来提现。
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
            <li>获得团子：+3</li>
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
        <el-collapse-item name="3">
          <h4
            slot="title"
            class="title"
          >
            视频限流
          </h4>
          <h5 class="subtitle">什么是视频限流</h5>
          <p class="p">
            目前 calibur 的视频资源，如果是本周更新的连载新番最新一话，则需要投食才能观看，其它资源都要求用户等级达到3级后才能观看
          </p>
          <p class="p">
            也就是说：新番没有等级限制，老番不需要投食
          </p>
          <h5 class="subtitle">为什么要限流</h5>
          <p class="p">
            因为站长没钱了，目前一个月的视频流量费已经接近两万，我已经支持不起了，再这么下去就得吃土了
          </p>
          <h5 class="subtitle">限流规则会改变吗</h5>
          <p class="p">
            限流的原因也就是因为我没钱了，并且已经产生了欠款，在我的资金恢复正常之前是不会取消限流的，目前的限流策略对<span class="strong">新人看旧番</span>很不友好，这是无奈之举
          </p>
          <p class="p">
            如果出现大量的人发垃圾内容刷等级迅速达到限流门槛，首先我会去删除内容扣经验，如果我管理不过来了，抱歉我只能提高这个门槛了，所以为了大部分人的权益，不要引导新人发垃圾内容，同时看到水贴就举报吧
          </p>
        </el-collapse-item>
        <el-collapse-item name="4">
          <h4
            slot="title"
            class="title"
          >
            分享这里
          </h4>
          <h5 class="subtitle">是否该分享这么小站？</h5>
          <p class="p">正如其它话题提到的，站长现在比较穷，再来更多的人看视频就要GG了~但还是希望大家把 calibur 分享给身边喜欢二次元的小伙伴，为什么？</p>
          <p class="p">因为你的分享，新用户的到来，正是对站长长久坚持努力的认可，同时新用户的到来也能够为社区注入新鲜血液，让社区活起来</p>
          <h5 class="subtitle">如何分享这个小站？</h5>
          <p class="p">
            每个用户都有自己的邀请码（详见各个主页），把自己的邀请码分享给你的朋友，其他人注册的时候只要填了你的邀请码，那么你就可以获得团子（每注册一个人获得一个团子）
          </p>
        </el-collapse-item>
        <el-collapse-item name="5">
          <h4
            slot="title"
            class="title"
          >
            申请版主
          </h4>
          <p class="p">如果你成为了吧主，那就代表你成为了这里重要的一员，因此我们在甄选吧主时会非常谨慎，你起码要满足一下要求：</p>
          <ul>
            <li>你要有足够的阅片量，是个真正的漫迷，足够强</li>
            <li>你要有充足的精力和耐心，与 calibur 一同成长</li>
            <li>你要有负责人的精神，不能滥用权限</li>
            <li>你要待人和善，不能有意伤害其他漫友</li>
            <li>思想正直，是社会主义的接班人~</li>
          </ul>
          <p class="p">如果你满足以上条件，请尽快联系我们<span class="strong">QQ群：106402736</span>，组织需要你！</p>
        </el-collapse-item>
        <el-collapse-item name="6">
          <h4
            slot="title"
            class="title"
          >
            尾巴
          </h4>
          <p class="p">一开始我只是因为喜欢动漫，从而萌生了创建 calibur 的这个想法，时至今日从我第一天开始坚持到现在已经过了3年，我经历了很久很久一段"无人问津"的时期，如今能坚持到与大家相见非常的开心，感谢大家来到这里</p>
          <p class="p">
            calibur 建设的初衷是：
            <span class="strong">为了让喜欢动漫的人，在为动漫付出的同时，既可以得到精神上的回报，也可以获得物质上的奖励</span>，
            让大家<span class="strong">不需要再用爱来发电</span>，
            因此有了团子系统，并且我坚持让团子可提现，都是为了贯彻我的初衷，保持最初的"纯粹"
          </p>
          <p class="p">
            然而 calibur 目前仍然处于初级阶段，有很多不完善的地方，这得给大家说声抱歉，我还做的不够好，必须继续努力
          </p>
          <p class="p">
            calibur 的定位是一个「二次元社区」，因此重要的就是<span class="strong">社区氛围</span>与<span class="strong">内容质量</span>
            如果大家想为 calibur 的成长做一点贡献，希望多发表一些高质量的内容，帮助社区成长
          </p>
          <p class="p">
            最后，感谢大家的到来，大家加油！
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
  head: {
    title: "帮助手册"
  },
  data() {
    return {
      activeName: this.$route.query.index || ""
    };
  }
};
</script>
