<style lang="scss">
#invite-user {
  height: 100vh;
  background-image: url("https://image.calibur.tv/owner/mobile.jpeg?imageMogr2/auto-orient/strip|imageView2/0/w/800");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  margin-top: -48px;
  padding-top: 48px;

  .container {
    padding-bottom: $container-padding;
  }

  .sub-title {
    margin-top: 30px;
    margin-bottom: 15px;
    margin-left: 13px;
  }

  .tips {
    background-color: #f4f4f5;
    color: #909399;
    padding: 12px 16px 8px 16px;
    margin: 0 5px 20px;
    border-radius: 4px;

    p {
      color: $color-text-normal;
      margin-bottom: 5px;
      font-size: 13px;
      line-height: 18px;
    }

    a {
      color: $color-blue-normal;
      font-size: 13px;
    }
  }

  .sign-up-form .tip {
    background-color: #fff;
    padding: 10px;
    border-radius: 5px;
  }

  .sign-wrap {
    background-color: rgba(255, 255, 255, 0.6);
    padding: 10px 20px 20px;
    border-radius: 10px;
    margin-top: 20px;
  }

  .signed {
    height: 112px;
    text-align: center;
    font-size: 14px;
    margin-top: 110px;
    line-height: 30px;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 10px 20px 20px;
    border-radius: 10px;
    color: $color-text-normal;

    a {
      color: $color-blue-normal;
    }
  }
}
</style>

<template>
  <div id="invite-user">
    <div class="container">
      <div
        v-if="isGuest"
        class="sign-wrap"
      >
        <h3 class="sub-title">欢迎来到 calibur.tv，是谁邀请你的呢？</h3>
        <div class="tips">
          <p>注册之后，邀请者会收到短信提示，并且获得 1 枚金币；</p>
          <p>由于站内视频流量过大，为了降低宽带费用，先需要注册后才能看番，影响到了大家的体验，非常抱歉；</p>
          <p>另外<a 
            href="/bangumi/34" 
            target="_blank">《进击的巨人》</a>资源每周同步更新，大家不要错过。</p>
        </div>
        <sign-up-form
          :invite-code="inviteUserId"
        />
      </div>
      <p 
        v-else 
        class="signed">
        你已经是注册用户了 (￣3￣)
        <br>
        快来邀请小伙伴一起注册 calibur 吧
        <br>
        点击查看<a href="/me/invite">我的邀请码</a>
      </p>
    </div>
  </div>
</template>

<script>
import SignUpForm from "~/components/forms/SignUpForm";

export default {
  name: "InviteUser",
  components: {
    SignUpForm
  },
  computed: {
    inviteUserId() {
      return this.$route.params.id;
    },
    isGuest() {
      return !this.$store.state.login;
    }
  }
};
</script>
