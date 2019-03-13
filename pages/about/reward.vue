<style lang="scss">
#reward {
  .calibur {
    p {
      font-size: 13px;
      line-height: 20px;
      text-align: center;
      margin: 30px 15px;
    }
  }

  .alipay,
  .wechat {
    padding: 30px 0 20px;

    img {
      width: 150px;
      height: 150px;
      display: block;
      margin: 0 auto;
    }

    p {
      margin-top: 20px;
      text-align: center;
      color: #fff;
      font-weight: bold;
    }
  }

  .alipay {
    background-color: RGB(31, 144, 230);
  }

  .wechat {
    background-color: RGB(81, 181, 86);
  }
}
</style>

<template>
  <div id="reward">
    <div class="calibur">
      <p>就算是1块钱的捐助，也能让 calibur 更好的发展</p>
    </div>
    <div class="alipay">
      <img src="~assets/img/alipay.png" >
      <p>支付宝</p>
    </div>
    <div class="wechat">
      <img src="~assets/img/wechat.png" >
      <p>微信</p>
    </div>
    <div class="calibur">
      <p>
        若您因为种种原因无法捐款，您仍可以通过其他方式为 calibur
        的发展做出贡献（帮助宣传等）
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Reward',
  head: {
    title: '捐赠'
  }
}
</script>
